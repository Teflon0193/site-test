import api from "@/lib/api";
export type UserRole = "MEMBER"|"ADMIN"|"SUPERVISEUR"|"DG"|"PROGRAMME_SUPERVISEUR"|"PROGRAMME_ASSISTANT"|"REGISSEUR_GENERAL"|"DIRECTION_ARTISTIQUE_SUPERVISEUR"|"DIRECTION_ARTISTIQUE_ASSISTANT"|"COMMUNICATION"|"JURIDIQUE_SUPERVISEUR"|"JURIDIQUE_ASSISTANT"|"FINANCE";
export interface User { id:number; email:string; first_name:string; last_name:string; phone?:string|null; role:UserRole|string; email_verified:number|boolean; created_at?:string; updated_at?:string }
export interface LoginResponse { success:boolean; message:string; token:string; user:User }
export interface RegisterData {email:string;password:string;first_name:string;last_name:string;phone?:string}
export interface RegisterResponse {success:boolean;message:string;emailSent?:boolean}
export interface MessageResponse {success:boolean;message:string}
export interface VerifyEmailResponse extends MessageResponse {user?:User}
const email=(value:string)=>String(value||"").trim().toLowerCase();
export async function login(email:string,password:string):Promise<LoginResponse>{const {data}=await api.post<LoginResponse>("/auth/login",{email:String(email).trim().toLowerCase(),password});if(!data.success||!data.token||!data.user)throw new Error(data.message||"Réponse de connexion invalide");return data;}
export async function getProfile():Promise<User>{const {data}=await api.get<{user?:User;data?:User}>("/auth/profile");const user=data.user??data.data;if(!user)throw new Error("Profil absent");return user;}
export async function register(v:RegisterData):Promise<RegisterResponse>{const {data}=await api.post<RegisterResponse>("/auth/register",{...v,email:email(v.email),first_name:v.first_name.trim(),last_name:v.last_name.trim(),phone:v.phone?.trim()||null});if(!data.success)throw new Error(data.message);return data;}
export async function forgotPassword(v:string):Promise<MessageResponse>{const {data}=await api.post<MessageResponse>("/auth/forgot-password",{email:email(v)});if(!data.success)throw new Error(data.message);return data;}
export async function resetPassword(token:string,password:string):Promise<MessageResponse>{const {data}=await api.post<MessageResponse>("/auth/reset-password",{token:token.trim(),new_password:password});if(!data.success)throw new Error(data.message);return data;}
export async function verifyEmail(token:string):Promise<VerifyEmailResponse>{const {data}=await api.get<VerifyEmailResponse>("/auth/verify-email",{params:{token:token.trim()}});if(!data.success)throw new Error(data.message);return data;}
export async function resendVerification(v:string):Promise<MessageResponse>{const {data}=await api.post<MessageResponse>("/auth/resend-verification",{email:email(v)});if(!data.success)throw new Error(data.message);return data;}
export async function updateProfile(v:Partial<User>):Promise<User>{const {data}=await api.put<{user?:User;data?:User}>("/auth/profile",v);const user=data.user??data.data;if(!user)throw new Error("Profil mis à jour absent");return user;}
