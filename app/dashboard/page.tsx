import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Folder, List, Grid } from "lucide-react";
import React from "react";
// import {getMyGroups} from "@/lib/services/groups";
// import {auth} from "@/lib/auth";

export default async function DashboardPage({
                                              searchParams,
                                            }: {
  searchParams: { view?: string; viewMode?: string };
}) {
  // const session = await auth();
  // const groups = await getMyGroups(session.id);
  const view = searchParams.view || "";
  const viewMode = searchParams.viewMode || "grid";

  const folders = Array.from({ length: 3 }).map((_, index) => ({
    id: index + 1,
    name: `Folder ${index + 1}`,
  }));

  const files = Array.from({ length: 6 }).map((_, index) => ({
    id: index + 1,
    name: `File ${index + 1}`,
    size: `${(index + 1) * 10} KB`,
    owner: "me",
    modified: `2023-11-${10 + index}`,
  }));

  return (
      <SidebarProvider
          style={
            {
              "--sidebar-width": "250px",
            } as React.CSSProperties
          }
      >
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 flex justify-between items-center gap-4 border-b bg-background p-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                  {view && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{view === "groups" ? "Groups" : "Files"}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <a
                  href={`?view=${view}&viewMode=list`}
                  className={`p-2 rounded-md ${
                      viewMode === "list" ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
              >
                <List className="w-5 h-5" />
              </a>
              <a
                  href={`?view=${view}&viewMode=grid`}
                  className={`p-2 rounded-md ${
                      viewMode === "grid" ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
              >
                <Grid className="w-5 h-5" />
              </a>
            </div>
          </header>
          <main className="p-4">
            {!view ? (
                viewMode === "grid" ? (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Folders</h2>
                      <div className="grid grid-cols-4 gap-4 mb-8">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          <Folder className="w-5 h-5" />
                        </span>
                                <span className="text-sm">{folder.name}</span>
                              </div>
                              <span className="text-muted-foreground">⋮</span>
                            </div>
                        ))}
                      </div>
                      <h2 className="text-lg font-semibold mb-4">Files</h2>
                      <div className="grid grid-cols-6 gap-4">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="grid place-items-center aspect-square rounded-lg bg-muted/80 p-2 hover:bg-muted cursor-pointer"
                            >
                              <p className="text-sm text-muted-foreground">{file.name}</p>
                            </div>
                        ))}
                      </div>
                    </div>
                ) : (
                    <div>
                      <table className="table-auto w-full text-left">
                        <thead className="border-b">
                        <tr>
                          <th className="py-2 px-4">Name</th>
                          <th className="py-2 px-4">Owner</th>
                          <th className="py-2 px-4">Last Modified</th>
                          <th className="py-2 px-4">File Size</th>
                        </tr>
                        </thead>
                        <tbody>
                        {folders.map((folder, index) => (
                            <React.Fragment key={folder.id}>
                              <tr className="hover:bg-muted cursor-pointer">
                                <td className="py-2 px-4 flex items-center gap-2">
                                  <Folder className="w-4 h-4" />
                                  {folder.name}
                                </td>
                                <td className="py-2 px-4">me</td>
                                <td className="py-2 px-4">-</td>
                                <td className="py-2 px-4">-</td>
                              </tr>
                              {index < folders.length && (
                                  <tr>
                                    <td colSpan={4}>
                                      <Separator className="my-2" />
                                    </td>
                                  </tr>
                              )}
                            </React.Fragment>
                        ))}
                        {files.map((file, index) => (
                            <React.Fragment key={file.id}>
                              <tr className="hover:bg-muted cursor-pointer">
                                <td className="py-2 px-4">{file.name}</td>
                                <td className="py-2 px-4">{file.owner}</td>
                                <td className="py-2 px-4">{file.modified}</td>
                                <td className="py-2 px-4">{file.size}</td>
                              </tr>
                              {index < files.length  && (
                                  <tr>
                                    <td colSpan={4}>
                                      <Separator className="my-2" />
                                    </td>
                                  </tr>
                              )}
                            </React.Fragment>
                        ))}
                        </tbody>
                      </table>
                    </div>
                )
            ) : view === "groups" && viewMode === "grid" ? (
                <div className="grid grid-cols-4 flex-1 gap-4 p-4">
                  {folders.map((folder) => (
                      <div
                          key={folder.id}
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      <Folder className="w-5 h-5" />
                    </span>
                          <span className="text-sm">{folder.name}</span>
                        </div>
                        <span className="text-muted-foreground">⋮</span>
                      </div>
                  ))}
                </div>
            ) : view === "groups" && viewMode === "list" ? (
                <table className="table-auto w-full text-left">
                  <thead className="border-b">
                  <tr>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Owner</th>
                    <th className="py-2 px-4">Last Modified</th>
                    <th className="py-2 px-4">File Size</th>
                  </tr>
                  </thead>
                  <tbody>
                  {folders.map((folder, index) => (
                      <React.Fragment key={folder.id}>
                        <tr className="hover:bg-muted cursor-pointer">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            {folder.name}
                          </td>
                          <td className="py-2 px-4">me</td>
                          <td className="py-2 px-4">-</td>
                          <td className="py-2 px-4">-</td>
                        </tr>
                        {index < folders.length && (
                            <tr>
                              <td colSpan={4}>
                                <Separator className="my-2" />
                              </td>
                            </tr>
                        )}
                      </React.Fragment>
                  ))}
                  </tbody>
                </table>
            ) : view === "files" && viewMode === "grid" ? (
                <div className="grid grid-cols-6 flex-1 gap-4 p-4">
                  {files.map((file) => (
                      <div
                          key={file.id}
                          className="grid place-items-center aspect-square rounded-lg bg-muted/80"
                      >
                        <p className="text-lg text-muted-foreground">{file.name}</p>
                      </div>
                  ))}
                </div>
            ) : (
                <table className="table-auto w-full text-left">
                  <thead className="border-b">
                  <tr>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Owner</th>
                    <th className="py-2 px-4">Last Modified</th>
                    <th className="py-2 px-4">File Size</th>
                  </tr>
                  </thead>
                  <tbody>
                  {files.map((file, index) => (
                      <React.Fragment key={file.id}>
                        <tr className="hover:bg-muted cursor-pointer">
                          <td className="py-2 px-4">{file.name}</td>
                          <td className="py-2 px-4">{file.owner}</td>
                          <td className="py-2 px-4">{file.modified}</td>
                          <td className="py-2 px-4">{file.size}</td>
                        </tr>
                        {index < files.length && (
                            <tr>
                              <td colSpan={4}>
                                <Separator className="my-2" />
                              </td>
                            </tr>
                        )}
                      </React.Fragment>
                  ))}
                  </tbody>
                </table>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
  );
}
