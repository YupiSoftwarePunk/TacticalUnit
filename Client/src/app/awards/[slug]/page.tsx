import { AwardDetailsPage } from "@/pages/award-details/ui/AwardDetailsPage";

export default function Page({ params }: { params: { slug: string } }) {
    return <AwardDetailsPage slug={params.slug} />;
}