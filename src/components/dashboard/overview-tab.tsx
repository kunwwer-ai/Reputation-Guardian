
"use client";

import type { Profile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, TrendingUp, TrendingDown, AlertTriangle, BarChartHorizontalBig, CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const MOCK_PROFILE: Profile = {
  id: "profile1",
  full_name: "Kunwer Sachdev",
  entity_type: "person",
  reputation_score: 82,
  threat_level: "ORANGE", 
  verified: true,
  last_updated: new Date(),
};

export function OverviewTab() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAvatarSrc, setCurrentAvatarSrc] = useState<string>("");


  const loadProfileAndAvatarData = () => {
    let currentProfileData = MOCK_PROFILE;
    const storedFullName = localStorage.getItem("settings_fullName");
    if (storedFullName) {
      currentProfileData = { ...currentProfileData, full_name: storedFullName };
    }
    setProfile(currentProfileData);

    const storedAvatar = localStorage.getItem("settings_avatarSrc");
    const initialChar = currentProfileData.full_name.charAt(0).toUpperCase() || 'P';
    const placeholderAvatar = `https://placehold.co/80x80.png?text=${initialChar}`;
    setCurrentAvatarSrc(storedAvatar || placeholderAvatar);
  };

  useEffect(() => {
    loadProfileAndAvatarData();
    setIsLoading(false);
    
    const handleSettingsUpdate = () => loadProfileAndAvatarData();
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('avatarUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('avatarUpdated', handleSettingsUpdate);
    };
  }, []);

  const getThreatBadgeVariant = (level: 'RED' | 'ORANGE' | 'GREEN') => {
    switch (level) {
      case 'RED': return 'destructive';
      case 'ORANGE': return { className: "bg-orange-500 text-primary-foreground hover:bg-orange-500/90" };
      case 'GREEN': return 'default'; 
      default: return 'outline';
    }
  };

  const getThreatIcon = (level: 'RED' | 'ORANGE' | 'GREEN') => {
    switch (level) {
      case 'RED': return <AlertTriangle className="mr-1 h-4 w-4" />;
      case 'ORANGE': return <AlertTriangle className="mr-1 h-4 w-4 text-orange-500" />; 
      case 'GREEN': return <ShieldCheck className="mr-1 h-4 w-4" />;
      default: return <ShieldCheck className="mr-1 h-4 w-4" />; 
    }
  };

  const handleViewAnalytics = (period: "monthly" | "weekly") => {
    localStorage.setItem("settings_analyticsDefaultTimePeriod", period);
    router.push('/dashboard#analytics');
  };


  if (isLoading || !profile) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-20 w-20 bg-muted rounded-full animate-pulse"></div>
            <div>
                <div className="h-7 bg-muted rounded w-48 animate-pulse"></div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
             <div className="h-10 bg-muted rounded w-32 animate-pulse mb-4"></div>
            <div className="h-5 bg-muted rounded w-1/3 animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                        <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    );
  }
  
  const avatarFallbackName = profile.full_name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || <User className="h-10 w-10" />;
  const threatBadgeStyle = getThreatBadgeVariant(profile.threat_level);

  return (
    <div className="space-y-6">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/80 to-primary p-6">
          <div className="flex items-center gap-4">
             <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                <AvatarImage src={currentAvatarSrc} alt={profile.full_name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-3xl bg-primary-foreground text-primary">
                  {avatarFallbackName}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-3xl font-headline text-primary-foreground">{profile.full_name}</CardTitle>
            </div>
            <div className="ml-auto flex items-center gap-2">
                {profile.verified && <Badge variant="secondary" className="bg-green-500 text-white"><ShieldCheck className="mr-1 h-4 w-4" />Verified</Badge>}
                <Badge 
                  variant={typeof threatBadgeStyle === 'string' ? threatBadgeStyle as any : 'default'}
                  className={typeof threatBadgeStyle === 'object' ? threatBadgeStyle.className : ''}
                >
                  {getThreatIcon(profile.threat_level)}
                  Threat: {profile.threat_level}
                </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold">Reputation Score</h3>
              <span className={`text-2xl font-bold ${profile.reputation_score >= 70 ? 'text-green-600' : profile.reputation_score >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                {profile.reputation_score} / 100
              </span>
            </div>
            <Progress value={profile.reputation_score} aria-label={`Reputation score: ${profile.reputation_score} out of 100`} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50">
              <CardHeader><CardTitle className="text-base flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500" />Positive Mentions</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">25</p></CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader><CardTitle className="text-base flex items-center"><TrendingDown className="mr-2 h-5 w-5 text-red-500" />Negative Mentions</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">2</p></CardContent>
            </Card>
             <Card className="bg-card/50 flex flex-col">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <BarChartHorizontalBig className="mr-2 h-5 w-5 text-primary" />
                  Trends
                </CardTitle>
                <CardDescription className="text-xs">Data volume over time.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center space-y-2 pt-2">
                <Button onClick={() => handleViewAnalytics("monthly")} variant="default" size="sm" className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" /> Monthly View
                </Button>
                <Button onClick={() => handleViewAnalytics("weekly")} variant="outline" size="sm" className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" /> Weekly View
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li>New interview published on Forbes (1 hour ago)</li>
                <li>Encyclopedia section "Major Achievements" updated (2 days ago)</li>
                <li>Social media sentiment shows slight positive shift (4 days ago)</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

