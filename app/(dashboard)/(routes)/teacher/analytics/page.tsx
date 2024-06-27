import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getAnalytics} from "@/actions/get-analytics";
import {DataCard} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import {Chart} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/chart";

const AnalyticsPage = async () => {

    const {userId} = auth();
    if (!userId) return redirect("/");

    const {data, totalSales, totalRevenue} = await getAnalytics(userId);


    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Total de Receita"
                    value={totalRevenue}
                    format
                />
                <DataCard
                    label="Total de vendas"
                    value={totalSales}
                />
            </div>
            <Chart
                data={data}
            />
        </div>
    );
}

export default AnalyticsPage;
