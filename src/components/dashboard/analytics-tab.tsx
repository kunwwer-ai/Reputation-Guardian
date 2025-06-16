
"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import type { EncyclopediaEntry, EncyclopediaSourceLink } from "@/types";
import { format, subMonths, startOfMonth, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ANALYTICS_SOURCE_SECTION_IDS = [
  "enc-all-search", "enc-news", "enc-blogs", "enc-youtube", "enc-podcasts",
  "enc-facebook", "enc-twitter-x", "enc-linkedin", "enc-instagram",
  "enc-other-social", "enc-google-locations", "enc-stories-features",
];

type AnalyticsTimePeriod = "monthly" | "weekly";

interface ChartDataPoint {
  name: string; // e.g., "Jan 24" or "Jul 28"
  key: string; // e.g., "2024-01" or "2024-W30"
  total: number;
}

export function AnalyticsTab() {
  const { entries } = useEncyclopediaContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<AnalyticsTimePeriod>("monthly");

  useEffect(() => {
    const loadDefaultTimePeriod = () => {
      const storedPeriod = localStorage.getItem("settings_analyticsDefaultTimePeriod") as AnalyticsTimePeriod | null;
      if (storedPeriod) {
        setSelectedTimePeriod(storedPeriod);
      }
    };
    loadDefaultTimePeriod();

    const handleSettingsUpdate = () => loadDefaultTimePeriod();
    window.addEventListener('analyticsSettingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('analyticsSettingsUpdated', handleSettingsUpdate);
  }, []);

  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    const relevantLinks: EncyclopediaSourceLink[] = [];
    entries.forEach(entry => {
      if (ANALYTICS_SOURCE_SECTION_IDS.includes(entry.id) && entry.source_links) {
        entry.source_links.forEach(link => {
          if (link.timestamp) {
            relevantLinks.push(link);
          }
        });
      }
    });

    const counts: Record<string, number> = {};
    relevantLinks.forEach(link => {
      if (link.timestamp) {
        const date = new Date(link.timestamp);
        let key: string;
        if (selectedTimePeriod === "monthly") {
          key = format(date, 'yyyy-MM');
        } else { // weekly
          key = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd'); // Monday as start of week
        }
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    const today = new Date();
    const dataPoints: ChartDataPoint[] = [];

    if (selectedTimePeriod === "monthly") {
      for (let i = 11; i >= 0; i--) {
        const monthDate = subMonths(startOfMonth(today), i);
        const monthKey = format(monthDate, 'yyyy-MM');
        const monthName = format(monthDate, "MMM yy");
        dataPoints.push({
          name: monthName,
          key: monthKey,
          total: counts[monthKey] || 0,
        });
      }
    } else { // weekly
      for (let i = 11; i >= 0; i--) { // Last 12 weeks
        const weekStartDate = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
        const weekKey = format(weekStartDate, 'yyyy-MM-dd');
        // const weekName = `W${format(weekStartDate, 'w')} '${format(weekStartDate, 'yy')}`;
        const weekName = format(weekStartDate, "MMM d"); // e.g. Jul 28
        dataPoints.push({
          name: weekName,
          key: weekKey,
          total: counts[weekKey] || 0,
        });
      }
    }
    return dataPoints;
  }, [entries, selectedTimePeriod]);

  useEffect(() => {
    if (entries) {
      setIsLoading(false);
    }
  }, [entries]);

  const chartConfig = {
    total: {
      label: "Items Added",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end mb-4">
          <div className="h-10 bg-muted rounded-md w-48 animate-pulse"></div>
        </div>
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
  
  const hasData = chartData.some(point => point.total > 0);
  const cardTitle = selectedTimePeriod === "monthly" 
    ? "Encyclopedia Content Volume (Last 12 Months)" 
    : "Encyclopedia Content Volume (Last 12 Weeks)";
  const cardDescription = selectedTimePeriod === "monthly"
    ? "Number of new links added to relevant Encyclopedia sections each month."
    : "Number of new links added to relevant Encyclopedia sections each week.";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Content Trends</h2>
        <RadioGroup
          value={selectedTimePeriod}
          onValueChange={(value) => setSelectedTimePeriod(value as AnalyticsTimePeriod)}
          className="flex items-center space-x-1 bg-muted p-1 rounded-md shadow-sm"
        >
          <Label 
            htmlFor="analytics-monthly-view" 
            className={`px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors
                        ${selectedTimePeriod === 'monthly' ? 'bg-background text-primary shadow-sm' : 'hover:bg-background/80'}`}
          >
            Monthly
          </Label>
          <RadioGroupItem value="monthly" id="analytics-monthly-view" className="sr-only" />
          
          <Label 
            htmlFor="analytics-weekly-view"
            className={`px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors
                        ${selectedTimePeriod === 'weekly' ? 'bg-background text-primary shadow-sm' : 'hover:bg-background/80'}`}
          >
            Weekly
          </Label>
          <RadioGroupItem value="weekly" id="analytics-weekly-view" className="sr-only" />
        </RadioGroup>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
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
                  domain={[0, 'dataMax + 2']}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 2px 8px hsl(var(--shadow-color) / 0.1)' 
                  }}
                  cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                />
                <Legend wrapperStyle={{paddingTop: '20px'}}/>
                <Bar dataKey="total" fill={chartConfig.total.color} radius={[4, 4, 0, 0]} name={chartConfig.total.label} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] border border-dashed rounded-md bg-muted/50">
              <p className="text-muted-foreground">No data available for the selected period. Add links with timestamps to your Encyclopedia.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

