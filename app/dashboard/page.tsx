import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectGrid from "@/modules/dashboard/components/project-grid";
import React from "react";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-start px-6 py-12">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <AddNewButton />
        <AddRepo />
      </div>

      <div className="mt-16 w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <ProjectGrid
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            onDuplicateProject={duplicateProjectById}
          />
        )}
      </div>
    </div>
  );
};

export default Page;