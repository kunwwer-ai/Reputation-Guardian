
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  // Profile Settings State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [whatsAppNotifications, setWhatsAppNotifications] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedFullName = localStorage.getItem("settings_fullName");
    if (storedFullName) setFullName(storedFullName);
    else setFullName("Kunwer Sachdev"); // Default if nothing stored

    const storedEmail = localStorage.getItem("settings_email");
    if (storedEmail) setEmail(storedEmail);
    else setEmail("kunwer.sachdev@example.com"); // Default if nothing stored

    const storedEmailNotifications = localStorage.getItem("settings_emailNotifications");
    if (storedEmailNotifications) setEmailNotifications(JSON.parse(storedEmailNotifications));

    const storedPushNotifications = localStorage.getItem("settings_pushNotifications");
    if (storedPushNotifications) setPushNotifications(JSON.parse(storedPushNotifications));
    
    const storedWhatsAppNumber = localStorage.getItem("settings_whatsAppNumber");
    if (storedWhatsAppNumber) setWhatsAppNumber(storedWhatsAppNumber);

    const storedWhatsAppNotifications = localStorage.getItem("settings_whatsAppNotifications");
    if (storedWhatsAppNotifications) setWhatsAppNotifications(JSON.parse(storedWhatsAppNotifications));
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("settings_fullName", fullName);
    localStorage.setItem("settings_email", email);
    toast({ title: "Profile Saved", description: "Your profile information has been updated." });
  };

  const handleSavePreferences = () => {
    localStorage.setItem("settings_emailNotifications", JSON.stringify(emailNotifications));
    localStorage.setItem("settings_pushNotifications", JSON.stringify(pushNotifications));
    localStorage.setItem("settings_whatsAppNumber", whatsAppNumber);
    localStorage.setItem("settings_whatsAppNotifications", JSON.stringify(whatsAppNotifications));
    toast({ title: "Preferences Saved", description: "Your notification preferences have been updated." });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight font-headline">Settings</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
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
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure how you receive notifications from the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive updates and alerts via email.
              </span>
            </Label>
            <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get real-time alerts on your device (if supported).
              </span>
            </Label>            
            <Switch id="pushNotifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
            <Input id="whatsAppNumber" type="tel" placeholder="e.g., +1234567890" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsAppNotifications" className="flex flex-col space-y-1">
              <span>WhatsApp Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive updates and alerts via WhatsApp.
              </span>
            </Label>
            <Switch id="whatsAppNotifications" checked={whatsAppNotifications} onCheckedChange={setWhatsAppNotifications} />
          </div>
           <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </CardContent>
      </Card>

       <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account security and data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
