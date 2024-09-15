import { Timestamp } from "firebase/firestore";
declare global {
    namespace DataBase {
        type WithIdType<T> = { id: string } & T;
        type WithOrder<T> = { order: number } & T;
        interface Price {
            num: number;
            currency: string;
        }
        type Roles = "admin" | "assistant" | "creator";
        type TimeStampToDate<T> = {
            [K in keyof T]: T[K] extends Timestamp ? Date : T[K];
        };
        type TimeStampToString<T> = {
            [K in keyof T]: T[K] extends Timestamp ? String : T[K];
        };

        type KeyToString<T, G extends string> = {
            [K in keyof T]: K extends G ? string : T[K];
        };
    }

    interface DataBase {
        Levels: DataBase.WithOrder<{
            name: string;
            desc: string;
            hide: boolean;
            teacherId: string;
            usersAdderIds: string[];
        }>;
        Courses: DataBase.WithOrder<{
            name: string;
            desc: string;
            hide: boolean;
            levelId: string;
            teacherId: string;
            featured: boolean;
            price: DataBase.Price;
            createdAt: Timestamp;
            publishedAt: Timestamp;
            paymentAdderIds: string[];
        }>;
        EnrolledUsersRecord: {
            payments: {
                paymentId: string;
                userId: string;
            }[];
            teacherId: string;
        };
        Lessons: DataBase.WithOrder<{
            name: string;
            briefDesc: string;
            desc: string;
            hide: boolean;
            courseId: string;
            createdAt: Timestamp;
            publishedAt: Timestamp;
            teacherId: string;
            adderIds: string[];
            video?:
                | ({
                      type: "youtube";
                      id: string;
                  } & {
                      hide: boolean;
                  })
                | null;
        }>;
        Exams: DataBase.WithOrder<
            {
                name: string;
                desc: string;
                hide: boolean;
                lessonId: string;
                courseId: string;
                teacherId: string;
                createdAt: Timestamp;
                repeatable: boolean;
                questionIds: Array<string>;
                time: number;
            } & (
                | {
                      random: true;
                      num: number;
                  }
                | {
                      random: false;
                      shuffle: boolean;
                  }
            )
        >;
        Questions: {
            quest: string;
            choices: Array<
                DataBase.WithOrder<
                    DataBase.WithIdType<{
                        textContext: string;
                    }>
                >
            >;
            answer: string;
            shuffle: boolean;
            lessonId: string;
            courseId: string;
            createdAt: Timestamp;
            creatorId: string;
        };
        Results: {
            courseId: string;
            teacherId: string;
            userId: string;
            examId: string;
            questions: Array<{
                questionId: string;
                state: "visited" | "unvisited" | "marked";
                answer?: string;
                correctAnswer?: string;
                correctState?: boolean;
            }>;
            time: number;
            startAt: Timestamp;
            endAt?: Timestamp;
        };
        Teacher: {
            type: DataBase.Roles;
            blocked: null | {
                teacherId: string;
                at: Timestamp;
            };
            createdAt: Timestamp;
            displayName: string;
            photoUrl?: string;
            email: string;
            phone?: string;
        };
        TeacherInfo: {
            contactEmail?: string;
            contactPhone?: string;
            address?: string;
            
        };
        Students: {
            teacherId: string;
            levelId: string;
            blocked: null | {
                teacherId: string;
                at: Timestamp;
            };
            displayname: string;
            phone?: string;
            createdAt: Timestamp;
        } & (
            | { emailVerified: boolean; email: string }
            | {
                  userName: string;
                  emailVerified?: boolean;
                  email?: string;
                  creatorId: string;
              }
        );
        AuthStudent: {
            passwordHash: string;
            passwordSalt: string;
        };
        Payments:
            | {
                  activatedAt: Timestamp;
                  userId: string;
                  courseId: string;
                  teacherId: string;
                  price: DataBase.Price;
              } & {
                  type: "admin";
                  creatorId: string;
              };
    }
}
