import { fetchStoriesServer } from "@/lib/api/serverApi";
import PopularClient from "./PopularClient";

interface PopularProps{
    withPagination?: boolean;
}

export default async function Popular({ withPagination }: PopularProps) {
    
    const firstStories = await fetchStoriesServer(1,4)
    return (
        <PopularClient
            firstStories={firstStories}
            withPagination={withPagination} />
    );
}