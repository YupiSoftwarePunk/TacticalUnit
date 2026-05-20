import AwardDetailsPage  from "@/pages/award-details/ui/AwardDetailsPage";

export default async function Page({ params }: { params: { slug: string } }) {
    const resolvedParams = await params;
    return <AwardDetailsPage slug={resolvedParams.slug} />;
}