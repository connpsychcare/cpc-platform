"use client";
import { useState } from "react";
import { Library, Upload } from "lucide-react";
import type { MediaQueryType, MediaResponse } from "@workspace/contracts/media";

import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

import { MediaGrid } from "./MediaGrid";
import MediaUploader from "./MediaUploader";
import { useMedias } from "@workspace/ui/hooks/use-media";
import Pagination from "@workspace/ui/shared/Pagination";
import FilterBar from "@workspace/ui/shared/FilterBar";

interface MediaLibraryProps {
  onSelect?: (media: MediaResponse) => void;
}

function MediaLibrary({ onSelect }: MediaLibraryProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState<MediaQueryType["searchBy"]>("name");
  const [sortBy] = useState<MediaQueryType["sortBy"]>("createdAt");
  const [sortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useMedias({
    page,
    limit,
    search,
    searchBy,
    sortBy,
    sortOrder,
  });

  return (
    <Tabs asChild defaultValue="library">
      <section className="space-y-8 overflow-hidden">
        <div className="flex max-lg:flex-wrap items-center justify-between gap-4">
          <TabsList className="bg-transparent gap-4 border w-full lg:w-1/2">
            <TabsTrigger value="upload">
              <Upload /> Upload
            </TabsTrigger>
            <TabsTrigger value="library">
              <Library /> Library
            </TabsTrigger>
          </TabsList>

          <FilterBar<MediaQueryType>
            search={search}
            setPage={setPage}
            setSearch={setSearch}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            filters={{}}
            setFilters={() => {}}
            searchByOptions={[
              { label: "Name", value: "name" },
              { label: "ID", value: "id" },
            ]}
            canAdd={false}
          />
        </div>
        <TabsContent value="upload">
          <MediaUploader onSelect={onSelect} />
        </TabsContent>
        <TabsContent value="library" className="space-y-6">
          <MediaGrid
            medias={data?.medias ?? []}
            isLoading={isLoading}
            onSelect={onSelect}
          />
          {data && (
            <Pagination
              total={data.total}
              limit={limit}
              currentPage={page}
              totalPages={data.totalPages}
              setLimit={setLimit}
              setPage={setPage}
            />
          )}
        </TabsContent>
      </section>
    </Tabs>
  );
}

export default MediaLibrary;
