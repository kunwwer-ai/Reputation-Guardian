
"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import type { EncyclopediaEntry, EncyclopediaSourceLink } from "@/types";
import { format, subMonths, startOfMonth } from 'date-fns';

// Define which encyclopedia sections contribute to the analytics
// These should ideally match or be a superset of MENTION_SOURCE_SECTION_IDS from mentions-tab
const ANALYTICS_SOURCE_SECTION_IDS = [
  "enc-all-search",
  "enc-news",
  "enc-blogs",
  "enc-youtube",
  "enc-podcasts",
  "enc-facebook",
  "enc-twitter-x",
  "enc-linkedin",
  "enc-instagram",
  "enc-other-social",
  "enc-google-locations",
  "enc-stories-features",
];

interface MonthlyData {
  name: string; // e.g., "Jan 24"
  key: string; // e.g., "2024-01"
  total: number;
}

export function AnalyticsTab() {
  const { entries } = useEncyclopediaContext();
  const [isLoading, setIsLoading] = useState(true);

  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    const relevantLinks: EncyclopediaSourceLink[] = [];
    entries.forEach(entry => {
      if (ANALYTICS_SOURCE_SECTION_IDS.includes(entry.id) && entry.source_links) {
        entry.source_links.forEach(link => {
          if (link.timestamp) { // Only include links with a timestamp
            relevantLinks.push(link);
          }
        });
      }
    });

    const monthlyCounts: Record<string, number> = {};

    relevantLinks.forEach(link => {
      if (link.timestamp) {
        const monthKey = format(new Date(link.timestamp), 'yyyy-MM');
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      }
    });

    const today = new Date();
    const last12Months: MonthlyData[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(startOfMonth(today), i);
      const monthKey = format(monthDate, 'yyyy-MM');
      const monthName = format(monthDate, "MMM yy");
      last12Months.push({
        name: monthName,
        key: monthKey,
        total: monthlyCounts[monthKey] || 0,
      });
    }
    return last12Months;
  }, [entries]);

  useEffect(() => {
    if (entries) {
      setIsLoading(false);
    }
  }, [entries]);

  const chartConfig = {
    total: {
      label: "Mentions",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="h-7 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 mt-1 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] bg-muted rounded-md animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const hasData = chartData.some(month => month.total > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold font-headline tracking-tight">Monthly Content Trends</h2>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Encyclopedia Content Volume (Last 12 Months)</CardTitle>
          <CardDescription>
            Number of new links added to relevant Encyclopedia sections each month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  allowDecimals={false}
                  domain={[0, 'dataMax + 2']} // Add some padding to Y-axis
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-md)' 
                  }}
                  cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                />
                <Legend wrapperStyle={{paddingTop: '20px'}}/>
                <Bar dataKey="total" fill={chartConfig.total.color} radius={[4, 4, 0, 0]} name="Total Items Added" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] border border-dashed rounded-md bg-muted/50">
              <p className="text-muted-foreground">No data available for the last 12 months. Add links with timestamps to your Encyclopedia.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
