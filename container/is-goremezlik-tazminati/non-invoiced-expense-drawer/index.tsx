"use client";
import { FC, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Form } from '@/components/form/form';
import * as Yup from 'yup';
import { FormField } from '@/components/form/types';
import { formatDate, formatDateString } from '@/utils/formatDate';
import { Trash2 } from "lucide-react";
import { Expense } from '../action';


interface NonInvoicedExpenseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    expenses: Expense[];
    setExpenses: (expenses: Expense[]) => void;
}

const validationSchema = Yup.object().shape({
    expenseType: Yup.string().required('Gider tipi zorunludur'),
    referenceNo: Yup.string().required('Referans no zorunludur'),
    date: Yup.date().required('Tarih zorunludur'),
    amount: Yup.number().required('Tutar zorunludur').min(0, 'Tutar 0\'dan küçük olamaz'),
    file: Yup.mixed().required('Dosya zorunludur'),
});

const fields = [
    {
        name: 'expenseType',
        label: 'Gider Tipi',
        type: 'select' as const,
        required: true,
        options: [
            { label: 'Ulaşım', value: 'transportation' },
            { label: 'Konaklama', value: 'accommodation' },
            { label: 'Yemek', value: 'food' },
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
        name: 'amount',
        label: 'Tutar',
        type: 'number' as const,
        required: true,
        endContent: '₺',
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

export const NonInvoicedExpenseDrawer: FC<NonInvoicedExpenseDrawerProps> = ({
    isOpen,
    onClose,
    expenses,
    setExpenses
}) => {
    const formRef = useRef<any>(null);
    
    const initialValues = {
        expenseType: '',
        amount: '',
        date: '',
        description: ''
    };

    const handleSubmit = async (values: any) => {
        const expense: Expense = {
           ...values,
           date: formatDate(values.date)
        };
        setExpenses([...expenses, expense]);
        formRef.current?.resetForm({ values: initialValues });
    };

    const handleDeleteExpense = (index: number) => {
        const newExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(newExpenses);
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
                <DrawerHeader className="flex flex-col gap-1">Fatura Edilemeyen Giderler</DrawerHeader>
                <DrawerBody>
                    <Form
                        formRef={formRef}
                        initialValues={initialValues}
                        fields={fields as FormField[]}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    />
                    {expenses.length > 0 && (
                        <div className="mb-4">
                            <Table aria-label="Giderler" className="mb-4">
                                <TableHeader>
                                    <TableColumn>GİDER TİPİ</TableColumn>
                                    <TableColumn>REFERANS NO</TableColumn>
                                    <TableColumn>TUTAR</TableColumn>
                                    <TableColumn>TARİH</TableColumn>
                                    <TableColumn>DOSYA</TableColumn>
                                    <TableColumn>İŞLEMLER</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {expenses.map((expense, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {fields.find(f => f.name === 'expenseType')?.options?.find(
                                                    opt => opt.value === expense.expenseType
                                                )?.label || expense.expenseType}
                                            </TableCell>
                                            <TableCell>{expense.referenceNo}</TableCell>
                                            <TableCell>{expense.amount} ₺</TableCell>
                                            <TableCell>{formatDateString(expense.date)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    variant="light"
                                                    onPress={() => window.open(URL.createObjectURL(expense.file))}
                                                >
                                                    Görüntüle
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    onPress={() => handleDeleteExpense(index)}
                                                    startContent={<Trash2 size={16} />}
                                                >
                                                    Sil
                                                </Button>
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