import { useMutation, useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import type { Dept, Success } from "../../middlewares/types.ts";
import axios from "axios";
import CircularProgress from "../../components/CircularProgress.tsx";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";

enum ValueType {
  IMAGE = "images",
  VIDEO = "video",
  TEXT = "text",
}

enum ValueMonitor {
  MAIN = "main",
  SIDE = "side",
}

const CREATE_ANNOUNCEMENT = gql`
  mutation createNewAnnounce($input: InputAnnouncement) {
    createNewAnnounce(input: $input) {
      message
      success
      announcement
    }
  }
`;

type MainSide = {
  value: string;
  type: ValueType;
  mute: boolean;
};

type Announcement = {
  _id: string;
  department: Dept;
  main: MainSide;
  side: MainSide;
};

const FIND_ANNOUNCEMENT = gql`
  query findAnnouncement {
    findAnnouncement {
      _id
      department {
        _id
        branch {
          name
          _id
        }
        name
      }
      main {
        mute
        type
        value
      }
      side {
        mute
        type
        value
      }
    }
  }
`;

const UPDATE_ANNOUNCEMENT = gql`
  mutation updateAnnounce($input: InputAnnouncement) {
    updateAnnounce(input: $input) {
      announcement
      success
      message
    }
  }
`;

const UploaderPage = () => {
  const [valueType, setValueType] = useState<ValueType>(ValueType.TEXT);
  const [monitorValue, setMonitorValue] = useState<ValueMonitor>(
    ValueMonitor.MAIN,
  );
  const { userLogged } = useSelector((state: RootState) => state.auth);
  const [textMessage, setTextMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const successValue = () => {
    setTextMessage(null);
    setIsUploading(false);
    setUploadProgress(0);
    setFile([]);
    setMonitorValue(ValueMonitor.MAIN);
    setValueType(ValueType.TEXT);
  };

  useEffect(() => {
    setFile([]);
    setTextMessage(null);
  }, [monitorValue, valueType]);

  const [createNewAnnounce] = useMutation<{ createNewAnnounce: Success }>(
    CREATE_ANNOUNCEMENT,
    {
      onCompleted: async (data) => {
        if (valueType !== ValueType.TEXT) {
          const formData = new FormData();
          file.forEach((f) => {
            formData.append(`${valueType}`, f);
          });

          await axios.post(
            `/upload/${valueType}/${data.createNewAnnounce.announcement}?side=${monitorValue === ValueMonitor.SIDE}`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                setIsUploading(true);

                if (progressEvent.total) {
                  const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                  );
                  setUploadProgress(percent);
                  if (percent === 100) {
                    successValue();
                  }
                }
              },
            },
          );
        } else {
          successValue();
        }
        toast("Successfully created announcement");
      },
    },
  );

  const [updateAnnounce] = useMutation<{ updateAnnounce: Success }>(
    UPDATE_ANNOUNCEMENT,
    {
      onCompleted: async (data) => {
        if (valueType !== ValueType.TEXT) {
          const formData = new FormData();
          file.forEach((f) => {
            formData.append(`${valueType}`, f);
          });
          console.log(valueType);
          await axios.post(
            `/upload/${valueType}/${data.updateAnnounce.announcement}?side=${monitorValue === ValueMonitor.SIDE}`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                setIsUploading(true);

                if (progressEvent.total) {
                  const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                  );
                  setUploadProgress(percent);
                  if (percent === 100) {
                    successValue();
                  }
                }
              },
            },
          );
        } else {
          successValue();
        }
        toast("Successfully created announcement");
      },
    },
  );

  const { data: announcementData, refetch: announcementRefetching } = useQuery<{
    findAnnouncement: Announcement;
  }>(FIND_ANNOUNCEMENT);

  useEffect(() => {
    const refetching = async () => {
      await announcementRefetching();
    };
    refetching();
  }, []);

  useEffect(() => {
    if (announcementData?.findAnnouncement) {
      setValueType(
        announcementData?.findAnnouncement[monitorValue]?.type
          ? (announcementData?.findAnnouncement[monitorValue]
              ?.type as ValueType)
          : ValueType.TEXT,
      );
    }
  }, [monitorValue, announcementData]);



  const Submit = useCallback(async () => {
    if (!announcementData?.findAnnouncement) {
      await createNewAnnounce({
        variables: {
          input: {
            value: valueType === ValueType.TEXT ? textMessage : "",
            type: valueType,
            side: monitorValue === ValueMonitor.SIDE,
          },
        },
      });
    } else {
      await updateAnnounce({
        variables: {
          input: {
            _id: announcementData?.findAnnouncement?._id,
            value: valueType === ValueType.TEXT ? textMessage : "",
            type: valueType,
            side: monitorValue === ValueMonitor.SIDE,
          },
        },
      });
    }
  }, [
    createNewAnnounce,
    valueType,
    monitorValue,
    file,
    announcementData,
    textMessage,
  ]);

  const havingSide = ["ADMIN", "HR", "SSD", "OPERATIONS"];
  const checkUserType = havingSide.includes(
    userLogged?.department.name as string,
  );
  if (isUploading) {
    return (
      <div className="h-full w-full border flex items-center justify-center">
        <CircularProgress progress={uploadProgress} />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex-col  overflow-hidden flex p-2">
      <div className="text-2xl font-bold text-slate-500">
        Upload Configurations
      </div>
      <div className="w-full h-full flex overflow-hidden ">
        <div className="h-full p-2 flex flex-col gap-2">
          {checkUserType && (
            <fieldset className="flex flex-col rounded p-2 gap-2 border">
              <legend className="px-2 text-2xl font-medium">Monitor</legend>
              {Object.entries(ValueMonitor).map(([key, value]) => {
                return (
                  <label key={key} className="flex gap-2">
                    <input
                      type="radio"
                      name="tv_monitor"
                      value={value}
                      onChange={(e) => {
                        setMonitorValue(e.target.value as ValueMonitor);
                      }}
                      checked={monitorValue === value}
                    />
                    <p className="capitalize font-medium">
                      {value === "side" ? "Broadcast" : value}
                    </p>
                  </label>
                );
              })}
            </fieldset>
          )}
          <fieldset className="flex flex-col rounded p-2 gap-2 border">
            <legend className="px-2 text-2xl font-medium">Options</legend>
            {Object.entries(ValueType).map(([key, value]) => {
              return (
                <label className="flex gap-2" key={key}>
                  <input
                    type="radio"
                    name="option"
                    value={value}
                    checked={valueType === value}
                    onChange={(e) => {
                      const value = e.target.value as ValueType;
                      setValueType(value);
                    }}
                  />
                  <p className="capitalize font-medium">{value}</p>
                </label>
              );
            })}
          </fieldset>

          <div className="flex items-center justify-center">
            <button onClick={Submit} className="border rounded w-full px-2 py-1.5 bg-slate-500 text-white hover:text-slate-500 hover:bg-white transition-all duration-300 cursor-pointer text-medium">Submit</button>
          </div>
        </div>
        <div className=" w-full h-full flex overflow-hidden p-5">
          <div className="w-full h-full border border-slate-300 rounded-2xl bg-slate-200 flex items-center justify-center">
            {valueType === ValueType.TEXT ? (
              <div>
                <textarea
                  name="for_text"
                  id="for_text"
                  className="resize-none border w-150 h-100 rounded-xl bg-white border-slate-300 p-2"
                  value={textMessage ?? ""}
                  onChange={(e) => {
                    const value =
                      e.target.value.trim() === "" ? null : e.target.value;
                    setTextMessage(value);
                  }}
                  placeholder="Add Text Here..."
                ></textarea>
              </div>
            ) : (
              <label className="border-5 border-dashed w-150 h-100 rounded-xl bg-white border-slate-300 flex items-center justify-center hover:cursor-pointer">
                {file.length > 0 ? (
                  <p className="text-2xl font-bold text-slate-400">
                    You Uploading {file[0].name}
                  </p>
                ) : (
                  <>
                    <div className=" w-50 h-50 rounded-full border-5 border-dashed border-slate-300 flex items-center justify-center">
                      <p className="text-2xl font-bold text-slate-300 capitalize">
                        Upload {valueType}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept={`${valueType}/*`}
                      hidden
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        setFile([...files]);
                      }}
                    />
                  </>
                )}
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploaderPage;
