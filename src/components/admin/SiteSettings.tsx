import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff, KeyRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Setting {
  key: string;
  value: string;
  description: string;
}

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    site_title: "",
    contact_email: "",
    admin_username: "",
    admin_password: "",
  });
  const [originalCredentials, setOriginalCredentials] = useState({
    admin_username: "",
    admin_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", ["site_title", "contact_email", "admin_username", "admin_password"]);

      if (error) throw error;

      if (data) {
        const settingsObj: any = {};
        data.forEach((setting: Setting) => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings((prev) => ({ ...prev, ...settingsObj }));
        
        // Store original credentials for comparison
        setOriginalCredentials({
          admin_username: settingsObj.admin_username || "",
          admin_password: settingsObj.admin_password || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    // Check if credentials have changed
    const credentialsChanged = 
      settings.admin_username !== originalCredentials.admin_username ||
      settings.admin_password !== originalCredentials.admin_password;

    // Validate that new credentials are different from old ones
    if (credentialsChanged) {
      if (settings.admin_username === originalCredentials.admin_username && 
          settings.admin_password !== originalCredentials.admin_password) {
        // Only password changed, that's okay
      } else if (settings.admin_username !== originalCredentials.admin_username && 
                 settings.admin_password === originalCredentials.admin_password) {
        // Only username changed, that's okay
      } else if (settings.admin_username === originalCredentials.admin_username && 
                 settings.admin_password === originalCredentials.admin_password) {
        toast({
          title: "No Changes",
          description: "Please enter new credentials different from the current ones.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate email if credentials changed
    if (credentialsChanged && !settings.contact_email) {
      toast({
        title: "Email Required",
        description: "Please enter a contact email to receive your credentials.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const settingsToUpdate = [
        {
          key: "site_title",
          value: settings.site_title,
          description: "Main site title used in SEO and branding",
        },
        {
          key: "contact_email",
          value: settings.contact_email,
          description: "Primary contact email for inquiries",
        },
        {
          key: "admin_username",
          value: settings.admin_username,
          description: "Admin panel username",
        },
        {
          key: "admin_password",
          value: settings.admin_password,
          description: "Admin panel password (encrypted)",
        },
      ];

      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(setting, { onConflict: "key" });

        if (error) throw error;
      }

      // Update original credentials after successful save
      setOriginalCredentials({
        admin_username: settings.admin_username,
        admin_password: settings.admin_password,
      });

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      // Automatically send email if credentials changed
      if (credentialsChanged) {
        await sendCredentialsEmail();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const sendCredentialsEmail = async () => {
    if (!settings.contact_email || !settings.admin_username || !settings.admin_password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all admin credentials and contact email first",
        variant: "destructive",
      });
      return;
    }

    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-admin-credentials', {
        body: {
          email: settings.contact_email,
          username: settings.admin_username,
          password: settings.admin_password,
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent!",
        description: `Admin credentials sent to ${settings.contact_email}`,
      });
    } catch (error: any) {
      console.error('Error sending credentials email:', error);
      toast({
        title: "Email Error",
        description: error.message || "Failed to send credentials email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage essential site configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site_title">Site Title</Label>
            <Input
              id="site_title"
              value={settings.site_title}
              onChange={(e) =>
                setSettings({ ...settings, site_title: e.target.value })
              }
              placeholder="e.g., Yadav's Portfolio"
            />
            <p className="text-sm text-muted-foreground">
              Used in SEO meta tags and browser title
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={settings.contact_email}
              onChange={(e) =>
                setSettings({ ...settings, contact_email: e.target.value })
              }
              placeholder="e.g., contact@example.com"
            />
            <p className="text-sm text-muted-foreground">
              Primary email for site inquiries and credential recovery
            </p>
          </div>

          <Button onClick={saveSettings} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Admin Credentials
          </CardTitle>
          <CardDescription>
            Update admin panel username and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="admin_username">Admin Username</Label>
            <Input
              id="admin_username"
              value={settings.admin_username}
              onChange={(e) =>
                setSettings({ ...settings, admin_username: e.target.value })
              }
              placeholder="Enter admin username"
            />
            <p className="text-sm text-muted-foreground">
              Username for admin panel login
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_password">Admin Password</Label>
            <div className="relative">
              <Input
                id="admin_password"
                type={showPassword ? "text" : "password"}
                value={settings.admin_password}
                onChange={(e) =>
                  setSettings({ ...settings, admin_password: e.target.value })
                }
                placeholder="Enter admin password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Password for admin panel login
            </p>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={saveSettings} disabled={saving} className="flex-1">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Credentials
            </Button>
            <Button 
              onClick={sendCredentialsEmail} 
              disabled={sendingEmail || !settings.contact_email}
              variant="outline"
              className="flex-1"
            >
              {sendingEmail && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Email Me Credentials
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">📧 Automatic Email Notification</p>
            <p className="text-xs text-muted-foreground">
              When you update your admin credentials, an email with the new username and password will be automatically sent to the contact email address.
            </p>
            <p className="text-xs text-muted-foreground">
              You can also manually send credentials anytime using the "Email Me Credentials" button.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
