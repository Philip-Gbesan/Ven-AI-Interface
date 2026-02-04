import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Shield,
  Trash2,
  AlertTriangle,
  Key,
  Bell,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Toggle from '../../../components/ui/Toggle';
import Badge from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import { getInstantById, formatBytes, formatDate } from '../../../data/mockData';

export default function Settings() {
  const { id } = useParams<{ id: string }>();
  const instance = getInstantById(id || '');
  const { addToast } = useToast();

  const [instanceName, setInstanceName] = useState(instance?.name || '');
  const [notifications, setNotifications] = useState({
    processingComplete: true,
    storageWarning: true,
    weeklyDigest: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!instance) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Instance not found</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    addToast({
      type: 'success',
      title: 'Settings saved',
      message: 'Your changes have been applied',
    });
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-1">
          Instance Settings
        </h1>
        <p className="text-sm text-zinc-500">
          Configure {instance.name}
        </p>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-800 rounded-sm flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">General</h2>
              <p className="text-sm text-zinc-500">Basic instance settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Instance Name"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Instance ID
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-sm text-zinc-400 font-mono">
                  {instance.id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(instance.id);
                    addToast({
                      type: 'info',
                      title: 'Copied',
                      message: 'Instance ID copied to clipboard',
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Created
                </label>
                <p className="text-sm text-zinc-400">
                  {formatDate(instance.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Storage Used
                </label>
                <p className="text-sm text-zinc-400">
                  {formatBytes(instance.storageUsed)} / {formatBytes(instance.maxStorage)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-800 rounded-sm flex items-center justify-center">
              <Shield className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Privacy & Security
              </h2>
              <p className="text-sm text-zinc-500">
                Data isolation and access control
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-sm">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-400 mb-1">
                    Private Container Active
                  </p>
                  <p className="text-xs text-green-400/70">
                    This instance is completely isolated. Data cannot be accessed
                    by other instances, users, or external systems.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Encryption at Rest
                </p>
                <p className="text-xs text-zinc-500">AES-256 encryption</p>
              </div>
              <Badge variant="success" size="sm">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Encryption in Transit
                </p>
                <p className="text-xs text-zinc-500">TLS 1.3</p>
              </div>
              <Badge variant="success" size="sm">Enabled</Badge>
            </div>

            <div className="pt-2">
              <Button variant="secondary" size="sm">
                <Key className="w-4 h-4" />
                Manage API Keys
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-800 rounded-sm flex items-center justify-center">
              <Bell className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Notifications
              </h2>
              <p className="text-sm text-zinc-500">
                Manage alert preferences
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Processing Complete
                </p>
                <p className="text-xs text-zinc-500">
                  Get notified when file processing finishes
                </p>
              </div>
              <Toggle
                enabled={notifications.processingComplete}
                onChange={(v) =>
                  setNotifications({ ...notifications, processingComplete: v })
                }
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Storage Warning
                </p>
                <p className="text-xs text-zinc-500">
                  Alert when storage reaches 80% capacity
                </p>
              </div>
              <Toggle
                enabled={notifications.storageWarning}
                onChange={(v) =>
                  setNotifications({ ...notifications, storageWarning: v })
                }
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Weekly Digest
                </p>
                <p className="text-xs text-zinc-500">
                  Summary of instance activity
                </p>
              </div>
              <Toggle
                enabled={notifications.weeklyDigest}
                onChange={(v) =>
                  setNotifications({ ...notifications, weeklyDigest: v })
                }
                size="sm"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card padding="lg" className="border-red-900/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-900/30 rounded-sm flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Danger Zone
              </h2>
              <p className="text-sm text-zinc-500">
                Irreversible actions
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-sm mb-4">
            <p className="text-sm text-red-400">
              Deleting this instance will permanently remove all uploaded files,
              embeddings, and query history. This action cannot be undone.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="w-4 h-4" />
              Delete Instance
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-300">
                Type <code className="text-red-400">{instance.name}</code> to confirm:
              </p>
              <Input placeholder={instance.name} />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger">
                  <Trash2 className="w-4 h-4" />
                  Permanently Delete
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
