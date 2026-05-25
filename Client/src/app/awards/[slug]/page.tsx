'use client';
import { MainHeader } from "@/components/Header/MainHeader";
import AwardDetailsPage  from "@/pages/award-details/ui/AwardDetailsPage";
import React, { useState } from "react";

export default function Page({ params }: { params: Promise<{slug: string}> }) {
    const {slug} = React.use(params);
    return (
        <div className="flex flex-col h-full">
            <div className="flex">
                <MainHeader></MainHeader>
            </div>
            <AwardDetailsPage slug={slug}></AwardDetailsPage>
        </div>
    );
}