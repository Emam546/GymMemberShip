// import { youtube_v3 } from "googleapis";

// export interface Props {
//     metadata: youtube_v3.Params$Resource$Videos$Insert["requestBody"];
//     access_token: string;
//     key: string;
//     part: string[];
//     media: Blob;
// }
// export function uploadYoutube({
//     key,
//     part,
//     metadata,
//     access_token,
//     media,
// }: Props) {
//     const xhr = new XMLHttpRequest();

//     xhr.open(
//         "POST",
//         `https://www.googleapis.com/upload/youtube/v3/videos?key=${key}&part=${part.join(
//             ","
//         )}`,
//         true
//     );
//     xhr.setRequestHeader("Authorization", "Bearer " + access_token);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.setRequestHeader("X-Upload-Content-Length", media.size.toString());
//     xhr.setRequestHeader("X-Upload-Content-Type", media.type);

//     xhr.onload = function (e) {
//         if (e.target.status < 400) {
//             const location = e.target.getResponseHeader("Location");
//             this.url = location;
//             _sendFile;
//         } else {
//             throw e;
//         }
//     };
//     xhr.onerror = (e) => {
//         console.error(e);
//     };
//     xhr.send(JSON.stringify(metadata));
// }
// function _sendFile({ location }: { location: string }) {}
