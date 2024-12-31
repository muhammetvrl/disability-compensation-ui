"use client";
import { FC } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button } from "@nextui-org/react";
import { Form } from '@/components/form/form';
import * as Yup from 'yup';
import { FormField } from '@/components/form/types';

interface DocumentUploadSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object().shape({
    documentType: Yup.string().required('Evrak tipi zorunludur'),
    referenceNo: Yup.string().required('Referans no zorunludur'),
    date: Yup.date().required('Tarih zorunludur'),
    file: Yup.mixed().required('Dosya zorunludur'),
});

const fields = [
    {
        name: 'documentType',
        label: 'Evrak Tipi',
        type: 'select' as const,
        required: true,
        options: [
            { label: 'Muayene Raporu', value: 'examination_report' },
            { label: 'Mahkeme Kararı', value: 'court_decision' },
            { label: 'SGK Belgesi', value: 'sgk_document' },
        ],
        col: 12
    },
    {
        name: 'referenceNo',
        label: 'Referans No',
        type: 'text' as const,
        required: true,
        col: 12
    },
    {
        name: 'date',
        label: 'Tarih',
        type: 'date' as const,
        required: true,
        col: 12
    },
    {
        name: 'file',
        label: 'Dosya Yükle',
        type: 'file' as const,
        required: true,
        accept: '.pdf,.doc,.docx',
        col: 12
    }
];

export const DocumentUploadSidebar: FC<DocumentUploadSidebarProps> = ({ isOpen, onClose }) => {
    const handleSubmit = async (values: any) => {
        console.log('Yüklenen dosya bilgileri:', values);
        // Burada dosya yükleme işlemlerini yapabilirsiniz
        onClose();
    };

    return (
        <Drawer 
            isOpen={isOpen} 
            onClose={onClose}
            placement="right"
            size="lg"
            scrollBehavior="inside"
        >
            <DrawerContent>
                <DrawerHeader className="flex flex-col gap-1">Evrak Listesi</DrawerHeader>
                <DrawerBody>
                    <Form
                        initialValues={{
                            documentType: '',
                            referenceNo: '',
                            date: '',
                            file: null
                        }}
                        fields={fields as FormField[]}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    />
                </DrawerBody>
                <DrawerFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Kapat
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}; 