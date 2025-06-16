
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function SettingsTab() {
  const { toast } = useToast();

  // Profile Settings State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

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


  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedFullName = localStorage.getItem("settings_fullName");
    if (storedFullName) setFullName(storedFullName);
    else setFullName("Kunwer Sachdev"); 

    const storedEmail = localStorage.getItem("settings_email");
    if (storedEmail) setEmail(storedEmail);
    else setEmail("kunwer.sachdev@example.com"); 

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
    window.dispatchEvent(new CustomEvent('settingsUpdated')); 
  };

  const handleSavePreferences = () => {
    localStorage.setItem("settings_emailNotifications", JSON.stringify(emailNotifications));
    localStorage.setItem("settings_pushNotifications", JSON.stringify(pushNotifications));
    localStorage.setItem("settings_whatsAppNumber", whatsAppNumber);
    localStorage.setItem("settings_whatsAppNotifications", JSON.stringify(whatsAppNotifications));
    toast({ title: "Preferences Saved", description: "Your notification preferences have been updated." });
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
    // Simulate password change
    toast({ title: "Password Changed", description: "Your password has been successfully updated." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setIsPasswordDialogOpen(false);
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
           <Button onClick={handleSavePreferences}>Save Preferences</Button>
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
