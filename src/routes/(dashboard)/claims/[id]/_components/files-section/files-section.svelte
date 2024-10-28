<script lang="ts">
    import { onMount } from 'svelte';
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/ui/accordion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/ui/card';
    import { ScrollArea } from '$lib/ui/scroll-area';
    import { FileIcon, ImageIcon } from 'lucide-svelte';
  
    type File = {
      file: Blob;
      extractedData: Record<string, string>;
      metadata: {
        name: string;
        size: number;
        type: string;
      };
    };a
  
    export let files: File[] = [];
  
    let loadedFiles: File[] = [];
  
    onMount(() => {
      if (files.length > 0) {
        loadedFiles = files;
      } else {
        // Sample files
        loadedFiles = [
          {
            file: new Blob(['Sample PDF content'], { type: 'application/pdf' }),
            extractedData: {
              title: "Sample Document",
              author: "John Doe",
              creationDate: "2023-05-15"
            },
            metadata: {
              name: "sample.pdf",
              size: 1024 * 1024, // 1 MB
              type: "application/pdf"
            }
          },
          {
            file: new Blob(['Sample text content'], { type: 'text/plain' }),
            extractedData: {
              wordCount: "100",
              language: "English",
              lastModified: "2023-05-16"
            },
            metadata: {
              name: "notes.txt",
              size: 512 * 1024, // 512 KB
              type: "text/plain"
            }
          },
          {
            file: new Blob(['<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>'], { type: 'image/svg+xml' }),
            extractedData: {
              dimensions: "100x100",
              colors: "black, red",
              software: "Adobe Illustrator"
            },
            metadata: {
              name: "circle.svg",
              size: 256 * 1024, // 256 KB
              type: "image/svg+xml"
            }
          }
        ];
      }
    });
  
    function formatFileSize(bytes: number): string {
      if (bytes < 1024) return bytes + " B";
      const kb = bytes / 1024;
      if (kb < 1024) return kb.toFixed(2) + " KB";
      const mb = kb / 1024;
      if (mb < 1024) return mb.toFixed(2) + " MB";
      const gb = mb / 1024;
      return gb.toFixed(2) + " GB";
    }
  </script>
  
  <Card class="w-full max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle>File Viewer</CardTitle>
      <CardDescription>View details of uploaded files</CardDescription>
    </CardHeader>
    <CardContent>
      {#if loadedFiles.length === 0}
        <p class="text-center text-muted-foreground">Loading files...</p>
      {:else}
        <Accordion type="single" collapsible>
          {#each loadedFiles as file, index}
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger>{file.metadata.name}</AccordionTrigger>
              <AccordionContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 class="text-lg font-semibold mb-2">File Preview</h3>
                    <!-- <FilePreview {file} /> -->
                  </div>
                  <div class="space-y-4">
                    <div>
                      <h3 class="text-lg font-semibold mb-2">Metadata</h3>
                      <Card>
                        <CardContent class="p-4">
                          <dl class="grid grid-cols-2 gap-2 text-sm">
                            <dt class="font-medium">Name:</dt>
                            <dd>{file.metadata.name}</dd>
                            <dt class="font-medium">Size:</dt>
                            <dd>{formatFileSize(file.metadata.size)}</dd>
                            <dt class="font-medium">Type:</dt>
                            <dd>{file.metadata.type}</dd>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold mb-2">Extracted Data</h3>
                      <Card>
                        <CardContent class="p-4">
                          <ScrollArea class="h-[200px]">
                            <dl class="grid grid-cols-2 gap-2 text-sm">
                              {#each Object.entries(file.extractedData) as [key, value]}
                                <dt class="font-medium">{key}:</dt>
                                <dd>{value}</dd>
                              {/each}
                            </dl>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          {/each}
        </Accordion>
      {/if}
    </CardContent>
  </Card>
<!--   
  <script lang="ts" context="module">
    function FilePreview({ file }: { file: File }) {
      let objectUrl: string | null = null;
  
      $: {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        objectUrl = URL.createObjectURL(file.file);
      }
  
      if (file.metadata.type.startsWith("image/")) {
        return `
          <div class="aspect-square relative">
            <img
              src="${objectUrl}"
              alt="${file.metadata.name}"
              class="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        `;
      }
  
      if (file.metadata.type === "application/pdf") {
        return `
          <iframe src="${objectUrl}" class="w-full aspect-square" title="${file.metadata.name}">
            This browser does not support PDFs. Please download the PDF to view it.
          </iframe>
        `;
      }
  
      return `
        <div class="aspect-square flex items-center justify-center bg-muted">
          ${file.metadata.type.startsWith("image/") ?
            '<ImageIcon class="w-16 h-16 text-muted-foreground" />' :
            '<FileIcon class="w-16 h-16 text-muted-foreground" />'
          }
        </div>
      `;
    }
  </script> -->