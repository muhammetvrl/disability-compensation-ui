"use client";
import { IncapacityCompensationResult } from "@/container/is-goremezlik-tazminati/result";
import { compensationService } from "@/services/compensations";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IncapacityCompensationResultPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await compensationService.detail(id as string);
      setDetail(res);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return <IncapacityCompensationResult id={id as string} detail={detail} />;
} 