"use client";
import { Breadcrumbs, BreadcrumbItem, Tabs, Tab } from "@nextui-org/react";
import React from "react";
import { DosyaBilgileri } from "./tabs/dosya-bilgileri";
import { HesaplamaBilgileri } from "./tabs/hesaplama-bilgileri";

export const IncapacityCompensationResult = ({ id, detail }: { id: string, detail: any } ) => {
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4 mt-9">
      <Breadcrumbs radius={"sm"} variant="solid">
        <BreadcrumbItem>Anasayfa</BreadcrumbItem>
        <BreadcrumbItem>İş Göremezlik Tazminatı</BreadcrumbItem>
        <BreadcrumbItem>Tazminat Hesabı Sonucu</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="text-xl font-semibold">Tazminat Hesabı Sonucu</h3>

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
          <Tab
            key="dosya-bilgileri"
            title="Dosya Bilgileri"
          >
            <DosyaBilgileri detail={detail} />
          </Tab>
          <Tab
            key="hesaplama-bilgileri"
            title="Hesaplama Bilgileri"
          >
            <HesaplamaBilgileri detail={detail} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}; 