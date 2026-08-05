const sseService = require("./sseService");
const http = require("http");
const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");

// Sliding window of transactions per outlet to feed to the Isolation Forest model
const transactionHistory = {};

// Static outlets to pick from in case database is offline
const staticOutlets = [
    { id: 1, name: "Nashik City Center" },
    { id: 2, name: "Pune FC Road" },
    { id: 3, name: "Mumbai Andheri East" },
    { id: 4, name: "Nagpur Dharampeth" },
    { id: 5, name: "Aurangabad CIDCO" },
    { id: 6, name: "Thane Estate" },
    { id: 7, name: "Kolhapur Tarabai Park" },
    { id: 8, name: "Solapur Saat Rasta" }
];

/**
 * Triggers Anomaly Detection call to the FastAPI ML microservice.
 * Returns anomaly metrics or null.
 */
async function checkAnomalyWithMl(outletId, transactions) {
    return new Promise((resolve) => {
        try {
            const body = JSON.stringify({
                outlet_id: Number(outletId),
                recent_transactions: transactions
            });

            const options = {
                hostname: "localhost",
                port: 8000,
                path: "/ml/detect/anomalies",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body),
                },
                timeout: 1000,
            };

            const req = http.request(options, (res) => {
                let data = "";
                res.on("data", (c) => { data += c; });
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        resolve(null);
                    }
                });
            });

            req.on("timeout", () => { req.destroy(); resolve(null); });
            req.on("error", () => { resolve(null); });
            req.write(body);
            req.end();
        } catch {
            resolve(null);
        }
    });
}

/**
 * Simulates a POS transaction:
 * - Generates random order volume & revenue.
 * - Deducts a random stock item.
 * - Invokes the isolation forest to score for anomalies.
 * - Broadcasts events to the client-side monitor.
 */
async function simulatePosTransaction() {
    try {
        // 1. Pick a random outlet
        let outlet = staticOutlets[Math.floor(Math.random() * staticOutlets.length)];
        
        try {
            const dbOutlets = await prisma.outlets.findMany({ select: { outlet_id: true, outlet_name: true } });
            if (dbOutlets && dbOutlets.length > 0) {
                const pick = dbOutlets[Math.floor(Math.random() * dbOutlets.length)];
                outlet = { id: pick.outlet_id, name: pick.outlet_name };
            }
        } catch (_) {
            // Fall back to static
        }

        // 2. Generate random transaction
        // Occasionally trigger a massive drop or spike to show off the Isolation Forest flagging it!
        const isAnomalyTrigger = Math.random() < 0.15;
        let revenue = Math.round(150 + Math.random() * 750);
        let orders = Math.floor(1 + Math.random() * 3);
        let customers = orders;

        if (isAnomalyTrigger) {
            if (Math.random() < 0.5) {
                // Critical drop (nearly empty transaction hour)
                revenue = Math.round(5 + Math.random() * 15);
                orders = 1;
                customers = 1;
            } else {
                // Spike (huge group purchase)
                revenue = Math.round(4500 + Math.random() * 3000);
                orders = Math.floor(12 + Math.random() * 8);
                customers = Math.floor(15 + Math.random() * 10);
            }
        }

        const transaction = {
            timestamp: new Date().toISOString(),
            revenue: parseFloat(revenue),
            orders: parseInt(orders),
            customers: parseInt(customers)
        };

        // Initialize history list if empty
        if (!transactionHistory[outlet.id]) {
            transactionHistory[outlet.id] = [];
            // pre-populate with normal transactions to train the forest
            for (let i = 0; i < 15; i++) {
                transactionHistory[outlet.id].push({
                    timestamp: new Date(Date.now() - (15 - i) * 60000).toISOString(),
                    revenue: parseFloat(200 + Math.random() * 400),
                    orders: Math.floor(1 + Math.random() * 2),
                    customers: Math.floor(1 + Math.random() * 2)
                });
            }
        }

        // Add current transaction and slice to maintain sliding window of 25 records
        transactionHistory[outlet.id].push(transaction);
        if (transactionHistory[outlet.id].length > 25) {
            transactionHistory[outlet.id].shift();
        }

        // 3. Save to DB if online
        try {
            await prisma.sales.create({
                data: {
                    outlet_id: Number(outlet.id),
                    sale_date: new Date(),
                    revenue: revenue,
                    orders: orders,
                    customers: customers
                }
            });
        } catch (_) {
            // DB offline, skip persisting
        }

        // 4. Run Anomaly check through Python ML service
        const anomalyResult = await checkAnomalyWithMl(outlet.id, transactionHistory[outlet.id]);

        // 5. Broadcast POS transaction event to UI
        sseService.broadcast("POS_TRANSACTION", {
            outlet_id: outlet.id,
            outlet_name: outlet.name,
            transaction,
            anomaly: anomalyResult
        });

        // 6. Broadcast anomaly alert specifically if Isolation Forest flags it
        if (anomalyResult && anomalyResult.has_anomaly) {
            sseService.broadcast("ANOMALY_ALERT", {
                outlet_id: outlet.id,
                outlet_name: outlet.name,
                reason: anomalyResult.reason,
                score: anomalyResult.score,
                timestamp: transaction.timestamp
            });
        }

    } catch (err) {
        console.error("POS transaction simulation error:", err);
    }
}

let timer = null;

function startSimulator() {
    if (timer) return;
    console.log("🚀 Live POS Transaction Simulator Started");
    // Simulate transaction every 7 seconds
    timer = setInterval(simulatePosTransaction, 7000);
}

function stopSimulator() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

module.exports = { startSimulator, stopSimulator };
