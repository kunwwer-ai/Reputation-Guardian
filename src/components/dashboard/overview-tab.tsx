
"use client";

import type { Profile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, User, Edit3 } from "lucide-react"; // Added Edit3
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useRef } from "react"; // Added useRef
import { useToast } from "@/hooks/use-toast"; // Added useToast

// Mock Data Updated for Kunwer Sachdev
const MOCK_PROFILE: Profile = {
  id: "profile1",
  full_name: "Kunwer Sachdev",
  entity_type: "person",
  reputation_score: 82,
  threat_level: "GREEN",
  verified: true,
  last_updated: new Date(Date.now() - 86400000 * 3), // 3 days ago
};

export function OverviewTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState<string>(`https://placehold.co/80x80.png`); // State for avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setProfile(MOCK_PROFILE);
      // Initialize avatarSrc based on profile or default
      const initialChar = MOCK_PROFILE.full_name.charAt(0) || 'P';
      setAvatarSrc(`https://placehold.co/80x80.png?text=${initialChar}`);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarSrc(reader.result as string);
        toast({ title: "Avatar Updated", description: "Your new avatar is now displayed." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading || !profile) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-16 w-16 bg-muted rounded-full animate-pulse"></div>
            <div>
                <div className="h-7 bg-muted rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-32 mt-2 animate-pulse"></div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
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

  const getThreatBadgeVariant = (level: Profile['threat_level']) => {
    switch (level) {
      case 'RED': return 'destructive';
      case 'YELLOW': return 'default'; 
      case 'GREEN': return 'default'; 
      default: return 'secondary';
    }
  };

  const getThreatIcon = (level: Profile['threat_level']) => {
    switch(level) {
        case 'RED': return <AlertTriangle className="mr-1 h-4 w-4" />;
        case 'YELLOW': return <AlertTriangle className="mr-1 h-4 w-4" />; 
        case 'GREEN': return <ShieldCheck className="mr-1 h-4 w-4" />;
        default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/80 to-primary p-6">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick} title="Click to change photo">
              <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                <AvatarImage src={avatarSrc} alt={profile.full_name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-2xl bg-primary-foreground text-primary">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Edit3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
              accept="image/*" 
            />
            <div>
              <CardTitle className="text-3xl font-headline text-primary-foreground">{profile.full_name}</CardTitle>
              <CardDescription className="text-primary-foreground/80 capitalize">
                {profile.entity_type} - Last Updated: {profile.last_updated.toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
                {profile.verified && <Badge variant="secondary" className="bg-green-500 text-white"><ShieldCheck className="mr-1 h-4 w-4" />Verified</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold">Reputation Score</h3>
              <span className={`text-2xl font-bold ${profile.reputation_score >= 70 ? 'text-green-600' : profile.reputation_score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                {profile.reputation_score} / 100
              </span>
            </div>
            <Progress value={profile.reputation_score} aria-label={`Reputation score: ${profile.reputation_score} out of 100`} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                    {getThreatIcon(profile.threat_level)}
                    Threat Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getThreatBadgeVariant(profile.threat_level)} className="text-lg px-3 py-1">{profile.threat_level}</Badge>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader><CardTitle className="text-base flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500" />Positive Mentions</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">25</p></CardContent> {/* Mock data */}
            </Card>
            <Card className="bg-card/50">
              <CardHeader><CardTitle className="text-base flex items-center"><TrendingDown className="mr-2 h-5 w-5 text-red-500" />Negative Mentions</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">2</p></CardContent> {/* Mock data */}
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
