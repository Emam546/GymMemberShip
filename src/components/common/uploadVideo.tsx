import { useState } from "react";
import { youtube_v3 } from "googleapis";
import PrimaryButton from "../button";
import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosRequestConfig } from "axios";
// import { MediaUploader } from "@src/utils/uploadFile";
export interface YouTubeVideoUploadResponse {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
  };
  status: {
    uploadStatus: string;
    privacyStatus: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
  };
}
const scopes = ["https://www.googleapis.com/auth/youtube.upload"];

export interface Props {
  videoTitle: string;
  videoDesc: string;
  onUploadStart?: () => any;
  onUploading?: (v: number) => any;
  onUploadComplete?: (data: YouTubeVideoUploadResponse) => any;
  onError?: (err: any) => any;
}
export default function UploadVideoYoutube({
  videoTitle,
  videoDesc,
  onUploadStart,
  onUploading,
  onUploadComplete,
  onError,
}: Props) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handelUpload(tokenResponse.access_token);
    },
    scope: scopes.join(" "),
  });
  async function handelUpload(access_token: string) {
    if (!videoFile) {
      alert("Select The Video First");
      return;
    }

    const requestData: youtube_v3.Params$Resource$Videos$Insert = {
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDesc,
          categoryId: "22",
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
    };

    try {
      onUploadStart && onUploadStart();
      const res = await axios.post(
        "https://youtube.googleapis.com/youtube/v3/videos",
        {
          snippet: {
            title: videoTitle,
            description: videoDesc,
            categoryId: "22",
          },
          status: {
            privacyStatus: "unlisted",
          },
        },

        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Upload-Content-Length": videoFile.size,
            "X-Upload-Content-Type": videoFile.type,
          },
          params: {
            part: "snippet,status",
            key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
          },
        }
      );
      onUploadComplete && onUploadComplete(res.data);
    } catch (err) {
      onError && onError(err);
    }
  }
  return (
    <div className="tw-flex tw-flex-col tw-items-stretch tw-gap-y-1 tw-w-fit">
      <label className="tw-w-64 tw-flex tw-flex-col tw-items-center tw-px-4 tw-py-6 tw-bg-white tw-text-blue-600 tw-rounded-lg tw-shadow-lg tw-tracking-wide tw-uppercase tw-border tw-border-blue-500 tw-cursor-pointer hover:tw-bg-blue-500 hover:tw-text-white">
        <svg
          className="tw-w-8 tw-h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="tw-mt-2 tw-text-base tw-leading-normal">
          Select a file
        </span>
        <input
          type="file"
          className="tw-hidden"
          accept="video/*"
          onChange={(event) => {
            setVideoFile(event.target.files && event.target.files[0]);
          }}
        />
      </label>
      <PrimaryButton
        onClick={() => {
          if (!videoFile) {
            alert("Select The Video First");
            return;
          }
          login();
        }}
        disabled={videoFile == undefined}
        type="button"
      >
        Upload Video
      </PrimaryButton>
    </div>
  );
}
