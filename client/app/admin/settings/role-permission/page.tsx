'use client'

import React from "react"
import Button from "@/components/ui/Button"
import Section from "@/components/ui/Section"
import { useQuery } from "@tanstack/react-query"
import { Fetch } from "@/config/axios.config"
import Select from "@/components/ui/Select"
import Pagination from "@/components/ui/Pagination"
import { MessageSquare, Plus, PencilLine, Trash } from "lucide-react"
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from "sonner"
import dynamic from "next/dynamic"

const DeleteUserRoleModal = dynamic(() => import("./_components/DeleteUserRoleModal"), {
    ssr: false,
    loading: () => <></>
})

const inputBase = "w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm text-sm text-carbon-black-900 placeholder:text-carbon-black-400"
const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    phone: yup.string().required('Phone number is required').min(10, 'Must be at least 10 characters'),
    role: yup.string().default('staff'),
    tables: yup.array().min(1, 'At least one table must be selected').required('Tables is required'),
})

export default React.memo(function RolePermissionPage() {
    const [deleteUserRoleInfo, setDeleteUserRoleInfo] = React.useState({ id: '', name: '', isOpen: false, isPending: false })
    const [editId, setEditId] = React.useState<string | null>(null)
    const [pagination, setPagination] = React.useState({ page: 1, limit: 10 })
    const { handleSubmit, control, formState: { errors, isSubmitting }, reset, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { name: '', phone: '+91', role: 'staff', tables: [] }
    })


    const { data: TablesData = [] } = useQuery({
        queryKey: ['tables'],
        queryFn: async () => {
            const res = await Fetch.get('/api/table/all/data', { withCredentials: true, withXSRFToken: true })
            return res.data.success
                ? res.data.data.map((table: any) => ({ label: table.name, value: table.id }))
                : []
        }
    })

    const { data: rolesResponse, refetch: roleRefetch, isLoading: roleIsLoading } = useQuery({
        queryKey: ['roles', pagination.page, pagination.limit],
        queryFn: async () => {
            const res = await Fetch.get(`/api/user/get-roles?page=${pagination.page}&limit=${pagination.limit}`, { withCredentials: true, withXSRFToken: true })
            return res.data.success ? {
                data: res.data.data,
                total: res.data.pagination.total
            } : { data: [], total: 0 }
        }
    })
    const roleData = rolesResponse?.data || [];

    const onSubmit = async (data: any) => {
        try {
            const res = await Fetch.post('/api/user/create',
                { ...data, password: data.phone.slice(3) },
                { withCredentials: true, withXSRFToken: true }
            )
            if (res.data.success) {
                toast.success(res.data.message || 'Assigned successfully!')
                reset()
                roleRefetch();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong!')
        }
    }

    const onUpdate = async (data: any) => {
        try {
            const res = await Fetch.put(`/api/user/update/${data.id}`, data, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                toast.success(res.data.message || 'Updated successfully!')
                roleRefetch();
                reset();
                setEditId(null);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong!')
        }
    }

    const onFormSubmit = async (data: any) => {
        if (editId) {
            await onUpdate({ ...data, id: editId });
        } else {
            await onSubmit(data);
        }
    }

    const handleEdit = React.useCallback((role: any) => {
        setEditId(role.id);
        setValue('name', role.name);
        setValue('phone', role.phone);
        setValue('role', role.role);
        setValue('tables', role.tables ? role.tables.map((t: any) => t.id) : []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [setValue]);

    const cancelEdit = React.useCallback(() => {
        setEditId(null);
        reset();
    }, [reset]);

    const onDelete = async (id: string) => {
        try {
            setDeleteUserRoleInfo(prev => ({ ...prev, isPending: true }))
            const res = await Fetch.delete(`/api/user/delete/${id}`, { withCredentials: true, withXSRFToken: true })
            if (res.data.success) {
                toast.success(res.data.message || 'Deleted successfully!')
                setDeleteUserRoleInfo({ id: '', name: '', isOpen: false, isPending: false })
                roleRefetch();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong!')
        } finally {
            setDeleteUserRoleInfo(prev => ({ ...prev, isPending: false }))
        }
    }

    const sendTestMessage = async ({ phone }: { phone: string }) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const urlencoded = new URLSearchParams();
            urlencoded.append("token", "7mpebaoqdbfoug89");
            urlencoded.append("to", phone);
            urlencoded.append("body", "Hello from Menunest");

            fetch('https://api.ultramsg.com/instance188886/messages/chat', {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            })
        } catch (error) {
            console.error(error);

        }
    }

    return (
        <>
            <div className="max-w-5xl">
                {/* -- Page Header -- */}
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-carbon-black-900">Users Management</h1>
                        <p className="text-carbon-black-500 mt-1">
                            Manage your restaurant's users and permissions.
                        </p>
                    </div>
                </div>

                {/* -- Assign Staff Form -- */}
                <Section className="mb-5">
                    {/* Section header */}
                    {/* <div className="flex items-center gap-3 pb-4 border-b border-carbon-black-100">
                    <UserPlus className="w-5 h-5 text-cayenne-red-500" />
                    <div>
                        <h2 className="text-base font-semibold text-carbon-black-900">Assign Staff</h2>
                        <p className="text-xs text-carbon-black-400 mt-0.5">
                            Add a staff member and assign them a role and tables.
                        </p>
                    </div>
                </div> */}

                    <form onSubmit={handleSubmit(onFormSubmit)} autoComplete="off">
                        <div className="flex flex-wrap items-start gap-4">

                            {/* Full Name */}
                            <div className="space-y-1.5 flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-carbon-black-700">
                                    Full Name
                                </label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            {...field}
                                            className={`${inputBase} ${errors.name ? '!border-cayenne-red-500 focus:ring-cayenne-red-500/20' : ''}`}
                                        />
                                    )}
                                />
                                {errors.name && <p className="text-xs text-cayenne-red-500 font-medium">{errors.name.message as string}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5 flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-carbon-black-700">
                                    Phone Number
                                </label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="tel"
                                            placeholder="+91 00000 00000"
                                            maxLength={13}
                                            {...field}
                                            onChange={(e) => {
                                                let val = e.target.value;
                                                if (!val.startsWith('+91')) {
                                                    const stripped = val.replace(/[^0-9]/g, '');
                                                    if (stripped.length >= 10) val = '+91' + stripped;
                                                    else val = '+91';
                                                }
                                                const digits = val.substring(3).replace(/[^0-9]/g, '');
                                                field.onChange('+91' + digits);
                                            }}
                                            className={`${inputBase} ${errors.phone ? '!border-cayenne-red-500 focus:ring-cayenne-red-500/20' : ''}`}
                                        />
                                    )}
                                />
                                {errors.phone && <p className="text-xs text-cayenne-red-500 font-medium">{errors.phone.message as string}</p>}
                            </div>

                            {/* Role */}
                            {/* <div className="space-y-1.5 flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-carbon-black-700">
                                Role
                            </label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        options={[
                                            { label: 'Staff', value: 'staff' },
                                            { label: 'Waiter', value: 'waiter' },
                                        ]}
                                        value={value}
                                        onChange={onChange}
                                        placeholder="Select role"
                                        error={errors.role?.message as string}
                                    />
                                )}
                            />
                        </div> */}

                            {/* Tables */}
                            <div className="space-y-1.5 flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-carbon-black-700">
                                    Assigned Tables
                                </label>
                                <Controller
                                    name="tables"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            multiple
                                            options={TablesData}
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Select tables"
                                            error={errors.tables?.message as string}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex items-start justify-end w-full mt-2 gap-2">
                                {editId && (
                                    <Button type="button" variant="secondary" onClick={cancelEdit} className="shrink-0">
                                        Cancel
                                    </Button>
                                )}
                                <Button type="submit" variant="primary" className="shrink-0" leftIcon={!editId ? <Plus /> : undefined} isLoading={isSubmitting}>
                                    {editId ? 'Update Staff' : 'Add Staff'}
                                </Button>
                            </div>
                        </div>
                    </form>

                </Section>

                <Section className="p-0 overflow-hidden border border-carbon-black-100 rounded-2xl shadow-sm bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-carbon-black-50/50 border-b border-carbon-black-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-carbon-black-900">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-carbon-black-900">Phone</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-carbon-black-900">Role</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-carbon-black-900">Assigned Tables</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-carbon-black-900 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-carbon-black-100">
                                {
                                    roleData?.map((role: any) => (
                                        <tr key={role?.id} className="hover:bg-carbon-black-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-carbon-black-900"> {role?.name} </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-carbon-black-600">{role?.phone}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-space-indigo-50 text-space-indigo-700 border border-space-indigo-200">
                                                    {role?.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-carbon-black-600">
                                                {role?.tables?.length > 0 ? role?.tables?.map((table: any) => table?.name).join(", ") : "No tables Assigned"}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <div className="relative group/tooltip">
                                                        <Button variant="secondary" size="sm" onClick={() => sendTestMessage(role)}>
                                                            <MessageSquare className="w-3 h-3" />
                                                        </Button>
                                                        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-10 flex flex-col items-center translate-y-1 group-hover/tooltip:translate-y-0">
                                                            <span className="bg-carbon-black-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-sm whitespace-nowrap"> Send Test Message</span>
                                                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-carbon-black-900"></div>
                                                        </div>
                                                    </div>
                                                    <div className="relative group/tooltip">
                                                        <Button variant="secondary" size="sm" onClick={() => handleEdit(role)}>
                                                            <PencilLine className="w-3 h-3" />
                                                        </Button>
                                                        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-10 flex flex-col items-center translate-y-1 group-hover/tooltip:translate-y-0">
                                                            <span className="bg-carbon-black-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-sm whitespace-nowrap">Edit</span>
                                                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-carbon-black-900"></div>
                                                        </div>
                                                    </div>
                                                    <div className="relative group/tooltip">
                                                        <Button variant="danger" size="sm" onClick={() => setDeleteUserRoleInfo({ id: role.id, name: role.name, isOpen: true, isPending: false })}>
                                                            <Trash className="w-3 h-3" />
                                                        </Button>
                                                        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-10 flex flex-col items-center translate-y-1 group-hover/tooltip:translate-y-0">
                                                            <span className="bg-cayenne-red-600 text-white text-[10px] font-medium px-2 py-1 rounded shadow-sm whitespace-nowrap">Delete</span>
                                                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-cayenne-red-600"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={Math.ceil((rolesResponse?.total || 0) / pagination.limit) || 1}
                        totalItems={rolesResponse?.total || 0}
                        limit={pagination.limit}
                        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                    />
                </Section>
            </div>

            <DeleteUserRoleModal
                isOpen={deleteUserRoleInfo.isOpen}
                onClose={() => setDeleteUserRoleInfo({ id: '', name: '', isOpen: false, isPending: false })}
                isPending={deleteUserRoleInfo.isPending}
                userRole={deleteUserRoleInfo}
                onDelete={onDelete}
            />
        </>
    )
})
