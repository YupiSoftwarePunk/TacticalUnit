import { MainHeader } from "@/components/Header/MainHeader";
import AwardDetailsPage  from "@/pages/award-details/ui/AwardDetailsPage";

export default async function Page({ params }: { params: { slug: string } }) {
    const resolvedParams = await params;
    return (
        <div className="flex flex-col h-full">
            {/* <MainHeader></MainHeader> */}
            <AwardDetailsPage slug={resolvedParams.slug} />
        </div>
    );
}