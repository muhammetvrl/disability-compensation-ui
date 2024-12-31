"use client";
import { FC } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button } from "@nextui-org/react";
import { Form } from '@/components/form/form';
import * as Yup from 'yup';
import { FormField } from '@/components/form/types';


interface NonInvoicedExpenseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object().shape({
    expenseType: Yup.string().required('Masraf tipi zorunludur'),
    referenceNo: Yup.string().required('Referans no zorunludur'),
    date: Yup.date().required('Tarih zorunludur'),
    amount: Yup.number().required('Tutar zorunludur').positive('Tutar pozitif olmalıdır'),
    file: Yup.mixed().required('Dosya zorunludur'),
});

const fields = [
    {
        name: 'expenseType',
        label: 'Masraf Tipi',
        type: 'select' as const,
        required: true,
        options: [
            { label: 'Yemek', value: 'food' },
            { label: 'Ulaşım', value: 'transportation' },
            { label: 'Konaklama', value: 'accommodation' },
            { label: 'Diğer', value: 'other' },
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
        name: 'amount',
        label: 'Tutar',
        type: 'number' as const,
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

export const NonInvoicedExpenseDrawer: FC<NonInvoicedExpenseDrawerProps> = ({ isOpen, onClose }) => {
    const handleSubmit = async (values: any) => {
        console.log('Gider bilgileri:', values);
        // Burada gider kaydetme işlemlerini yapabilirsiniz
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
                <DrawerHeader className="flex flex-col gap-1">
                    Fatura Edilemeyen Gider Listesi
                </DrawerHeader>
                <DrawerBody>
                    <Form
                        initialValues={{
                            expenseType: '',
                            referenceNo: '',
                            date: '',
                            amount: '',
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