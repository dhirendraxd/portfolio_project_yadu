import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Setting {
  key: string;
  value: string;
  description: string;
}

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    site_title: "",
    contact_email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", ["site_title", "contact_email"]);

      if (error) throw error;

      if (data) {
        const settingsObj: any = {};
        data.forEach((setting: Setting) => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings((prev) => ({ ...prev, ...settingsObj }));
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
      ];

      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(setting, { onConflict: "key" });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
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
            Primary email for site inquiries
          </p>
        </div>

        <Button onClick={saveSettings} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default SiteSettings;
