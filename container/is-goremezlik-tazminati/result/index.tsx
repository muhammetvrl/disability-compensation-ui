"use client";
import { Breadcrumbs, BreadcrumbItem, Tabs, Tab, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Switch, Textarea } from "@heroui/react";
import React, { useCallback, useState } from "react";
import { IncapacityApprovalForm } from "@/helpers/types";
import { Formik } from "formik";
import * as Yup from "yup";
import { compensationService } from "@/services/compensations";
import { DosyaBilgileri } from "./tabs/dosya-bilgileri";
import { HesaplamaBilgileri } from "./tabs/hesaplama-bilgileri";
import { Documents } from "./tabs/documents";

const IncapacityApprovalSchema = Yup.object().shape({
  disabilityRate: Yup.number().required("Engel oranı zorunludur"),
  temporaryDisabilityDay: Yup.number().required("Geçici engel günü zorunludur"),
});

const IncapacityRejectSchema = Yup.object().shape({
  rejectReason: Yup.string().required("Reddetme nedeni zorunludur"),
});

interface IncapacityCompensationResultProps {
  id: string;
  detail: any;
}

export const IncapacityCompensationResult = ({ id, detail }: IncapacityCompensationResultProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = useCallback(async (values: IncapacityApprovalForm) => {
    setIsLoading(true);
    try {
      debugger
      const formData = {
        ...values,
        disabilityRate: Number(values.disabilityRate),
        temporaryDisabilityDay: Number(values.temporaryDisabilityDay)
      };
      await compensationService.approve(detail.id, formData);
      alert("Tazminat başarıyla onaylandı!");
    } catch (error) {
      console.error("Onay işlemi başarısız:", error);
      alert("Onay işlemi sırasında bir hata oluştu!");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }, [detail]);

  const handleReject = useCallback(async (values: { id: string; rejectReason: string }) => {
    setIsLoading(true);
    try {
      await compensationService.reject(values.id, values);
      alert("Tazminat başarıyla reddedildi!");
    } catch (error) {
      console.error("Reddetme işlemi başarısız:", error);
      alert("Reddetme işlemi sırasında bir hata oluştu!");
    } finally {
      setIsLoading(false);
      setIsRejectModalOpen(false);
    }
  }, []);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4 mt-9">
      <Breadcrumbs radius={"sm"} variant="solid">
        <BreadcrumbItem>Anasayfa</BreadcrumbItem>
        <BreadcrumbItem>İş Göremezlik Tazminatı</BreadcrumbItem>
        <BreadcrumbItem>Tazminat Hesabı Sonucu</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="text-xl font-semibold mb-6">Tazminat Hesabı Sonucu</h3>

      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Tazminat Hesabı Tabs"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab key="file-info" title="Dosya Bilgileri">
            <DosyaBilgileri detail={detail} />
          </Tab>
          <Tab key="calc-info" title="Hesaplama Bilgileri">
            <HesaplamaBilgileri detail={detail} />
          </Tab>
          <Tab key="documents" title="Belgeler">
            <Documents detail={detail} />
          </Tab>
        </Tabs>

        <div className="flex w-full gap-2 justify-end mt-6">
          <Button variant="shadow" color="success" onClick={() => setIsModalOpen(true)}>
            Onayla
          </Button>
          <Button variant="shadow" color="danger" onClick={() => setIsRejectModalOpen(true)}>
            Reddet
          </Button>
        </div>
      </div>

      {/* Onay Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Tazminat Onaylama</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                id: detail?.id,
                disabilityRate: "0",
                hasTemporaryDisability: false,
                hasCaregiver: false,
                temporaryDisabilityDay: "0",
              }}
              validationSchema={IncapacityApprovalSchema}
              onSubmit={handleApprove}
            >
              {({ values, errors, touched, handleChange, handleSubmit, setFieldValue, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Engel Oranı (%0-100)"
                      name="disabilityRate"
                      type="number"
                      value={values.disabilityRate}
                      onChange={handleChange}
                      isInvalid={!!errors.disabilityRate && !!touched.disabilityRate}
                      errorMessage={touched.disabilityRate && errors.disabilityRate}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />
                    <Input
                      label="Geçici Engel Günü"
                      name="temporaryDisabilityDay"
                      type="number"
                      value={values.temporaryDisabilityDay}
                      onChange={handleChange}
                      isInvalid={!!errors.temporaryDisabilityDay && !!touched.temporaryDisabilityDay}
                      errorMessage={touched.temporaryDisabilityDay && errors.temporaryDisabilityDay}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Switch
                      name="hasTemporaryDisability"
                      isSelected={values.hasTemporaryDisability}
                      onValueChange={(checked:boolean) => setFieldValue("hasTemporaryDisability", checked)}
                      size="lg"
                      className="w-full"
                    >
                      <span className="text-sm">Geçici Engel</span>
                    </Switch>
                    <Switch
                      name="hasCaregiver"
                      isSelected={values.hasCaregiver}
                      onValueChange={(checked:boolean) => setFieldValue("hasCaregiver", checked)}
                      size="lg"
                      className="w-full"
                    >
                      <span className="text-sm">Hemşirelik Bakım</span>
                    </Switch>
                  </div>

                  <div className="flex w-full justify-end gap-2 mt-4">
                    <Button
                      type="submit"
                      color="success"
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? "Onaylanıyor..." : "Onayla"}
                    </Button>
                    <Button variant="flat" color="danger" onPress={() => setIsModalOpen(false)}>
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Reddetme Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Tazminat Reddetme</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                id: detail?.id,
                rejectReason: ""
              }}
              validationSchema={IncapacityRejectSchema}
              onSubmit={handleReject}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Textarea
                      label="Reddetme Nedeni"
                      name="rejectReason"
                      value={values.rejectReason}
                      onChange={handleChange}
                      isInvalid={!!errors.rejectReason && !!touched.rejectReason}
                      errorMessage={touched.rejectReason && errors.rejectReason}
                      variant="bordered"
                      isRequired
                      className="w-full"
                      minRows={4}
                    />
                  </div>

                  <div className="flex w-full justify-end gap-2 mt-4">
                    <Button
                      type="submit"
                      color="danger"
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? "Reddediliyor..." : "Reddet"}
                    </Button>
                    <Button variant="flat" color="success" onPress={() => setIsRejectModalOpen(false)}>
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};