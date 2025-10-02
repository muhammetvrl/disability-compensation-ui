"use client";

import { ProfileSchema } from "@/helpers/schemas";
import { ProfileFormType } from "@/helpers/types";
import { authService } from "@/services/auth";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from "@heroui/react";
import { Formik } from "formik";
import { useCallback, useEffect, useState } from "react";

function Profile() {
  const [initialValues, setInitialValues] = useState<ProfileFormType>({
    id: "",
    email: "",
    name: "",
    surname: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData && userData.id) {
          setInitialValues({
            id: userData.id,
            email: userData.email || "",
            name: userData.name || "",
            surname: userData.surname || "",
            password: "",
            confirmPassword: "",
          });
        }
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenirken hata oluştu:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleUpdateProfile = useCallback(async (values: ProfileFormType) => {
    setIsLoading(true);
    setUpdateSuccess(false);
    
    try {
      const profileData = { ...values };
      if (!profileData.password) {
        delete profileData.password;
      }
      delete profileData.confirmPassword;

      const { data } = await authService.updateProfile(profileData);
      
      if (data.success && typeof window !== 'undefined') {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...userData, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setUpdateSuccess(true);
        
        setInitialValues(prev => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error("Profil güncellenirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-xl font-bold">Profil Ayarları</p>
            <p className="text-small text-default-500">Kişisel bilgilerinizi güncelleyin</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={ProfileSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Ad"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name && !!touched.name}
                    errorMessage={touched.name && errors.name}
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    label="Soyad"
                    name="surname"
                    value={values.surname}
                    onChange={handleChange}
                    isInvalid={!!errors.surname && !!touched.surname}
                    errorMessage={touched.surname && errors.surname}
                    variant="bordered"
                    isRequired
                  />
                </div>
                
                <Input
                  label="E-posta"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email && !!touched.email}
                  errorMessage={touched.email && errors.email}
                  variant="bordered"
                  isRequired
                />
                
                <Divider className="my-2" />
                <p className="text-small text-default-500 mb-2">Şifre değiştirmek için aşağıdaki alanları doldurun (isteğe bağlı)</p>
                
                <Input
                  label="Yeni Şifre"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password && !!touched.password}
                  errorMessage={touched.password && errors.password}
                  variant="bordered"
                />
                
                <Input
                  label="Şifre Onayı"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword && !!touched.confirmPassword}
                  errorMessage={touched.confirmPassword && errors.confirmPassword}
                  variant="bordered"
                />
                
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={isLoading}
                    isDisabled={isSubmitting}
                  >
                    Profili Güncelle
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </CardBody>
        {updateSuccess && (
          <CardFooter>
            <div className="w-full bg-success-50 text-success p-3 rounded-lg">
              Profil bilgileriniz başarıyla güncellendi.
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default Profile;