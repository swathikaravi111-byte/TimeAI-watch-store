import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { Alert } from '@components/common/Alert'
import { useAuthStore } from '@/store'
import { authApi } from '@/services/api/auth'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Alert type="error" title="Not Authenticated">
          Please log in to view your profile.
        </Alert>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setError(null)
      setIsSaving(true)
      const updatedUser = await authApi.updateProfile(formData)
      setUser(updatedUser)
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setError(null)
      setIsSaving(true)
      await authApi.changePassword(passwordData.oldPassword, passwordData.newPassword)
      setSuccessMessage('Password changed successfully!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setIsChangingPassword(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-gray-600">Manage your profile and account settings</p>
        </div>

        {successMessage && (
          <Alert type="success" className="mb-6" dismissible onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert type="error" className="mb-6" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Profile Summary */}
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.firstName.charAt(0)}
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                <p className="mt-1 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      isLoading={isSaving}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">First Name</dt>
                    <dd className="mt-1 text-base text-gray-900">{user.firstName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Last Name</dt>
                    <dd className="mt-1 text-base text-gray-900">{user.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Email</dt>
                    <dd className="mt-1 text-base text-gray-900">{user.email}</dd>
                  </div>
                </dl>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Password & Security</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                >
                  {isChangingPassword ? 'Cancel' : 'Change Password'}
                </Button>
              </div>
            </CardHeader>
            {isChangingPassword && (
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, oldPassword: e.target.value }))
                    }
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      isLoading={isSaving}
                      onClick={handleChangePassword}
                    >
                      Update Password
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export { ProfilePage }
