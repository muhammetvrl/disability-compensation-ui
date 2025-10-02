"use client";
import { FC, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, CalendarDate } from "@heroui/react";
import { Form } from '@/components/form/form';
import * as Yup from 'yup';
import { FormField } from '@/components/form/types'
import { formatDateString, formatDateToUTC } from '@/utils/formatDate';
import { Trash2 } from "lucide-react";
import { FormikHelpers } from 'formik';
import { Document } from '../action';
import { useFetch } from '@/hooks/use-fetch';


interface DocumentUploadSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    documents: Document[];
    setDocuments: (documents: Document[]) => void;
}


export const DocumentUploadSidebar: FC<DocumentUploadSidebarProps> = ({
    isOpen,
    onClose,
    documents,
    setDocuments
}) => {
    const formRef = useRef<any>(null);
    const { data: documentTypes } = useFetch<any[]>('/parameters/search', {
        method: 'POST',
        data: {
            codes: ['document_type']
        }
    });


    
    const initialValues = {
        documentType: '',
        referenceNo: '',
        date: '',
        file: null
    };


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
        options: documentTypes?.map((type) => ({
            label: type.name,
            value: type.code
        })),
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

    const handleSubmit = async (values: any, formikHelpers: FormikHelpers<any>) => {
        try {
            const document: Document = {
                documentType: values.documentType,
                referenceNo: values.referenceNo,
                date: formatDateToUTC(values.date) || '',
                file: values.file
            };
            setDocuments([...documents, document]);
            formikHelpers.resetForm();
        } catch (error) {
            console.error('Form submission error:', error);
            formikHelpers.setSubmitting(false);
        }
    };

    const handleDeleteDocument = (index: number) => {
        const newDocuments = documents.filter((_, i) => i !== index);
        setDocuments(newDocuments);
        formRef.current?.resetForm({ values: initialValues });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            placement="right"
            size="2xl"
            scrollBehavior="inside"
        >
            <DrawerContent>
                <DrawerHeader className="flex flex-col gap-1">Evrak Listesi</DrawerHeader>
                <DrawerBody>
                    <Form
                        formRef={formRef}
                        initialValues={initialValues}
                        fields={fields as FormField[]}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonProps={{
                            children: "Kaydet",
                            color: "primary",
                            className: "w-full"
                        }}
                    />
                    {documents.length > 0 && (
                        <div className="mb-4">
                            <Table aria-label="Yüklenen Dökümanlar" className="mb-4">
                                <TableHeader>
                                    <TableColumn>EVRAK TİPİ</TableColumn>
                                    <TableColumn>REFERANS NO</TableColumn>
                                    <TableColumn>TARİH</TableColumn>
                                    <TableColumn>İŞLEMLER</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {fields.find(f => f.name === 'documentType')?.options?.find(
                                                    opt => opt.value === doc.documentType
                                                )?.label || doc.documentType}
                                            </TableCell>
                                            <TableCell>{doc.referenceNo}</TableCell>
                                            <TableCell>
                                                {formatDateString(doc.date)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        variant="light"
                                                        onPress={() => window.open(URL.createObjectURL(doc.file as any))}
                                                    >
                                                        Görüntüle
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        onPress={() => handleDeleteDocument(index)}
                                                        startContent={<Trash2 size={16} />}
                                                    >
                                                        Sil
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
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