
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
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
            <Input id="fullName" defaultValue="Kunwer Sachdev" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="kunwer.sachdev@example.com" />
          </div>
          <Button>Save Profile</Button>
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
            <Switch id="emailNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get real-time alerts on your device (if supported).
              </span>
            </Label>
            <Switch id="pushNotifications" />
          </div>
           <Button>Save Preferences</Button>
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
