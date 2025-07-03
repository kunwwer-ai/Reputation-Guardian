"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit3, Save, XCircle, BarChart2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

type AnalyticsTimePeriod = "monthly" | "weekly";

export default function SettingsPage() {
  const { toast } = useToast();

  // Profile Settings State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savedAvatarSrc, setSavedAvatarSrc] = useState<string>("");
  const [previewAvatarSrc, setPreviewAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [whatsAppNotifications, setWhatsAppNotifications] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // Analytics Settings State
  const [analyticsDefaultTimePeriod, setAnalyticsDefaultTimePeriod] = useState<AnalyticsTimePeriod>("monthly");


  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedFullName = localStorage.getItem("settings_fullName");
    const currentName = storedFullName || "Kunwer Sachdev";
    setFullName(currentName); 

    const storedEmail = localStorage.getItem("settings_email");
    if (storedEmail) setEmail(storedEmail);
    else setEmail("kunwer.sachdev@example.com"); 

    const storedAvatar = localStorage.getItem("settings_avatarSrc");
    const initialChar = currentName.charAt(0).toUpperCase() || 'P';
    const placeholderAvatar = `https://placehold.co/80x80.png?text=${initialChar}`;
    setSavedAvatarSrc(storedAvatar || placeholderAvatar);
     if (!storedAvatar) {
        setPreviewAvatarSrc(null);
    }

    const storedEmailNotifications = localStorage.getItem("settings_emailNotifications");
    if (storedEmailNotifications) setEmailNotifications(JSON.parse(storedEmailNotifications));

    const storedPushNotifications = localStorage.getItem("settings_pushNotifications");
    if (storedPushNotifications) setPushNotifications(JSON.parse(storedPushNotifications));
    
    const storedWhatsAppNumber = localStorage.getItem("settings_whatsAppNumber");
    if (storedWhatsAppNumber) setWhatsAppNumber(storedWhatsAppNumber);

    const storedWhatsAppNotifications = localStorage.getItem("settings_whatsAppNotifications");
    if (storedWhatsAppNotifications) setWhatsAppNotifications(JSON.parse(storedWhatsAppNotifications));
    
    const storedAnalyticsPeriod = localStorage.getItem("settings_analyticsDefaultTimePeriod") as AnalyticsTimePeriod | null;
    if (storedAnalyticsPeriod) setAnalyticsDefaultTimePeriod(storedAnalyticsPeriod);

  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("settings_fullName", fullName);
    localStorage.setItem("settings_email", email);
    if (!localStorage.getItem("settings_avatarSrc")) {
        const initialChar = fullName.charAt(0).toUpperCase() || 'P';
        setSavedAvatarSrc(`https://placehold.co/80x80.png?text=${initialChar}`);
    }
    toast({ title: "Profile Saved", description: "Your profile information has been updated." });
    window.dispatchEvent(new CustomEvent('settingsUpdated')); 
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatarSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (previewAvatarSrc) {
      localStorage.setItem("settings_avatarSrc", previewAvatarSrc);
      setSavedAvatarSrc(previewAvatarSrc);
      setPreviewAvatarSrc(null); 
      toast({ title: "Avatar Updated", description: "Your new avatar has been saved." });
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
    }
  };

  const handleCancelPhotoChange = () => {
    setPreviewAvatarSrc(null); 
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  const handleSavePreferences = () => {
    localStorage.setItem("settings_emailNotifications", JSON.stringify(emailNotifications));
    localStorage.setItem("settings_pushNotifications", JSON.stringify(pushNotifications));
    localStorage.setItem("settings_whatsAppNumber", whatsAppNumber);
    localStorage.setItem("settings_whatsAppNotifications", JSON.stringify(whatsAppNotifications));
    localStorage.setItem("settings_analyticsDefaultTimePeriod", analyticsDefaultTimePeriod);
    toast({ title: "Preferences Saved", description: "Your notification and analytics preferences have been updated." });
    window.dispatchEvent(new CustomEvent('analyticsSettingsUpdated')); // Notify analytics tab
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all password fields." });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
      return;
    }
    toast({ title: "Password Changed", description: "Your password has been successfully updated." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setIsPasswordDialogOpen(false);
  };
  
  const displayAvatarSrc = previewAvatarSrc || savedAvatarSrc;
  const avatarFallbackName = fullName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || <User className="h-10 w-10" />;


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight font-headline">Settings</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your public profile information and avatar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <Avatar className="h-20 w-20 border-2 border-muted shadow-md">
              <AvatarImage src={displayAvatarSrc} alt={fullName} data-ai-hint="user avatar settings" />
              <AvatarFallback className="text-3xl">
                {avatarFallbackName}
              </AvatarFallback>
            </Avatar>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
              accept="image/*" 
            />
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <Button variant="outline" onClick={triggerFileInput}>
                <Edit3 className="mr-2 h-4 w-4" /> Change Photo
              </Button>
              {previewAvatarSrc && (
                <>
                  <Button onClick={handleSavePhoto}>
                    <Save className="mr-2 h-4 w-4" /> Save Photo
                  </Button>
                  <Button variant="ghost" onClick={handleCancelPhotoChange}>
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-4">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile}>Save Profile</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Configure notifications and default views.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-3">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotificationsTab" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive updates and alerts via email.
                  </span>
                </Label>
                <Switch id="emailNotificationsTab" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotificationsTab" className="flex flex-col space-y-1">
                  <span>Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get real-time alerts on your device (if supported).
                  </span>
                </Label>            
                <Switch id="pushNotificationsTab" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="whatsAppNumberTab">WhatsApp Number</Label>
                <Input id="whatsAppNumberTab" type="tel" placeholder="e.g., +1234567890" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsAppNotificationsTab" className="flex flex-col space-y-1">
                  <span>WhatsApp Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive updates and alerts via WhatsApp.
                  </span>
                </Label>
                <Switch id="whatsAppNotificationsTab" checked={whatsAppNotifications} onCheckedChange={setWhatsAppNotifications} />
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-md font-medium mb-3 flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" /> Analytics Preferences</h3>
            <div className="space-y-2">
              <Label>Default Analytics Time Period</Label>
              <RadioGroup 
                value={analyticsDefaultTimePeriod} 
                onValueChange={(value) => setAnalyticsDefaultTimePeriod(value as AnalyticsTimePeriod)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="analytics-monthly" />
                  <Label htmlFor="analytics-monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="analytics-weekly" />
                  <Label htmlFor="analytics-weekly">Weekly</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">Set the default view for the Content Trends chart in the Analytics tab.</p>
            </div>
          </div>
           <Button onClick={handleSavePreferences}><Save className="mr-2 h-4 w-4" /> Save Preferences</Button>
        </CardContent>
      </Card>
      
      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Configure third-party API keys for services like web scraping.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-md bg-muted/50 border">
              <h4 className="font-semibold text-foreground">Web Scraping API</h4>
              <p className="text-sm text-muted-foreground mt-1">
                  To enable a third-party scraping service, you must set the following variables in the <code>.env</code> file at the root of your project:
              </p>
              <div className="mt-3 space-y-2 text-xs font-mono bg-background p-3 rounded-md">
                  <p>SCRAPING_API_KEY="YOUR_KEY_HERE"</p>
                  <p># Example for ScraperAPI, adjust for your service:</p>
                  <p>SCRAPING_API_ENDPOINT="http://api.scraperapi.com?api_key=&#123;API_KEY&#125;&url=&#123;URL&#125;"</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                  The action code will replace <code>&#123;API_KEY&#125;</code> and <code>&#123;URL&#125;</code> with the correct values at runtime. If these are not set, the app will attempt a direct, less reliable fetch.
              </p>
          </div>
        </CardContent>
      </Card>

       <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Change Password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and a new password below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentPasswordTab" className="text-right col-span-1">
                    Current
                  </Label>
                  <Input
                    id="currentPasswordTab"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPasswordTab" className="text-right col-span-1">
                    New
                  </Label>
                  <Input
                    id="newPasswordTab"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirmNewPasswordTab" className="text-right col-span-1">
                    Confirm
                  </Label>
                  <Input
                    id="confirmNewPasswordTab"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}>Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleChangePassword}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
