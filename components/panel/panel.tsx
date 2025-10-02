import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@heroui/react";

interface PanelProps {
    title: string;
    children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, children }) => {
    return (
        <Card className="w-full">
            <CardHeader className="flex gap-3">
                <h6 className="font-semibold">{title}</h6>
            </CardHeader>
            <Divider />
            <CardBody>
                {children}
            </CardBody>
        </Card>
    );
};

export default Panel;


