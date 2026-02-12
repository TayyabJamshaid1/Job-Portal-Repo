import { getCurrentUser } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
//   // Define as many FileRoutes as you like, each with a unique routeSlug
//   imageUploader: f({
//     image: {
//       /**
//        * For full list of options and defaults, see the File Route API reference
//        * @see https://docs.uploadthing.com/file-routes#route-config
//        */
//       maxFileSize: "4MB",
//       maxFileCount: 1,
//     },
//   })
//     // Set permissions and file types for this FileRoute
//     .middleware(async ({ req }) => {
//       // This code runs on your server before upload
//       const user = await getCurrentUser();

//       // If you throw, the user will not be able to upload
//       if (!user) throw new UploadThingError("Unauthorized");

//       // Whatever is returned here is accessible in onUploadComplete as `metadata`
//       return { userId: user.id };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       // This code RUNS ON YOUR SERVER after upload
//       console.log("Upload complete for userId:", metadata.userId);

//       console.log("file url", file.ufsUrl);

//       // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
//       return { uploadedBy: metadata.userId };
//     }),
// } satisfies FileRouter;
// core.ts
export const ourFileRouter = {
  // For single image uploads
  singleImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new UploadThingError("Unauthorized");
      return { userId: currentUser.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Single upload complete for userId:", metadata.userId);
      return { 
        uploadedBy: metadata.userId, 
        url: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name
      };
    }),

  // For multiple image uploads
  multiImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 3,
    },
  })
    .middleware(async ({ req }) => {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new UploadThingError("Unauthorized");
      return { userId: currentUser.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Multiple uploads complete for userId:", metadata.userId);
      
      // Note: When uploading multiple files, UploadThing calls this
      // callback multiple times (once per file), not with an array
      return { 
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
