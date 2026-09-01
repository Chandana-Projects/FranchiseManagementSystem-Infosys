import { NextResponse } from "next/server";

export async function GET() {
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();

  return NextResponse.json(
    {
      status: "healthy",
      service: "omnifranchise-web-portal",
      version: "1.0.0-production",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        formatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
      },
      system: {
        nodeVersion: process.version,
        memoryHeapUsedMB: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
        memoryHeapTotalMB: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
      },
      microservices: {
        expressBackend: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
        pythonMLService: "http://localhost:8000",
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
