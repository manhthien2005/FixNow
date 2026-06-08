import {
  CalendarClock,
  CalendarDays,
  CircleX,
  FileText,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { getServiceGroupLabel } from "@/lib/labels";
import { DEVICE_ICON, STATUS_STEPS, STATUS_UI } from "@/lib/appointment-ui";
import { formatDateByLocale } from "@/lib/utils";
import type { AppointmentStatus, DeviceType } from "@/db/schema";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export interface AppointmentDetailData {
  customerName: string;
  phone: string;
  address: string;
  deviceType: DeviceType;
  serviceGroup: string;
  issueDescription: string;
  preferredTime: Date | string | null;
  status: AppointmentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function InfoTile({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface-container/40 p-5 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 text-on-surface-variant">
        <Icon className="size-4 shrink-0 text-secondary" aria-hidden="true" />
        <span className="font-mono text-label-sm uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="mt-2 text-body-lg text-on-surface">{children}</div>
    </div>
  );
}

/** Shared appointment presentation: status stepper + sectioned info tiles. */
export async function AppointmentDetail({
  appt,
}: {
  appt: AppointmentDetailData;
}) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const DeviceIcon = DEVICE_ICON[appt.deviceType];
  const isCancelled = appt.status === "CANCELLED";
  const currentStep = STATUS_STEPS.indexOf(appt.status);

  return (
    <div className="space-y-6">
      {/* Status progress */}
      {isCancelled ? (
        <div className="glass-panel flex items-center gap-3 rounded-2xl border-destructive/30 bg-destructive/5 p-5">
          <CircleX className="size-6 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <p className="text-body-lg font-semibold text-on-surface">
              {dictionary.labels.appointmentStatus.CANCELLED}
            </p>
            <p className="text-body-md text-on-surface-variant">
              {locale === "vi"
                ? "FixNow sẽ không liên hệ lại theo lịch này."
                : "FixNow will not contact you for this appointment."}
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <p className="mb-6 font-mono text-label-sm uppercase tracking-widest text-secondary">
            &gt; {locale === "vi" ? "TIẾN TRÌNH" : "PROGRESS"}
          </p>
          <ol className="flex items-center">
            {STATUS_STEPS.map((step, i) => {
              const stepUi = STATUS_UI[step];
              const StepIcon = stepUi.icon;
              const done = i <= currentStep;
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <li
                  key={step}
                  className={`flex items-center ${isLast ? "" : "flex-1"}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`flex size-11 items-center justify-center rounded-full border transition-colors ${
                        done
                          ? `${stepUi.border} ${stepUi.bg} ${stepUi.text}`
                          : "border-border bg-surface-container/40 text-on-surface-variant/40"
                      }`}
                    >
                      <StepIcon className="size-5" aria-hidden="true" />
                    </span>
                    <span
                      className={`text-center font-mono text-[11px] uppercase tracking-wider ${
                        done ? "text-on-surface" : "text-on-surface-variant/40"
                      }`}
                    >
                      {dictionary.labels.appointmentStatus[step]}
                    </span>
                  </div>
                  {!isLast ? (
                    <span
                      className={`mx-2 -mt-6 h-0.5 flex-1 rounded-full ${
                        i < currentStep ? stepUi.dot : "bg-surface-container-high"
                      }`}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Contact + address */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoTile icon={UserRound} label={dictionary.common.customer}>
          {appt.customerName}
        </InfoTile>
        <InfoTile icon={Phone} label={dictionary.common.phone}>
          <a
            href={`tel:${appt.phone}`}
            className="font-mono transition-colors hover:text-secondary"
          >
            {appt.phone}
          </a>
        </InfoTile>
        <InfoTile
          icon={MapPin}
          label={locale === "vi" ? "Địa chỉ sửa chữa" : "Repair address"}
          className="sm:col-span-2"
        >
          {appt.address}
        </InfoTile>
      </div>

      {/* Device + service + time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoTile icon={DeviceIcon} label={dictionary.booking.deviceType}>
          {dictionary.labels.deviceType[appt.deviceType]}
        </InfoTile>
        <InfoTile icon={Wrench} label={dictionary.booking.serviceGroup}>
          {getServiceGroupLabel(appt.serviceGroup, locale)}
        </InfoTile>
        <InfoTile
          icon={CalendarClock}
          label={dictionary.booking.preferredTime}
          className="sm:col-span-2"
        >
          {appt.preferredTime
            ? formatDateByLocale(appt.preferredTime, locale)
            : locale === "vi"
              ? "Linh hoạt"
              : "Flexible"}
        </InfoTile>
      </div>

      {/* Issue */}
      <InfoTile icon={FileText} label={dictionary.booking.issue}>
        <p className="whitespace-pre-wrap break-words text-body-md leading-relaxed text-on-surface-variant">
          {appt.issueDescription}
        </p>
      </InfoTile>

      {/* Meta */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-container/30 px-4 py-3">
          <CalendarDays className="size-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
          <span className="font-mono text-label-sm text-on-surface-variant">
            {locale === "vi" ? "Ngày tạo" : "Created"}:{" "}
            {formatDateByLocale(appt.createdAt, locale)}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-container/30 px-4 py-3">
          <RefreshCw className="size-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
          <span className="font-mono text-label-sm text-on-surface-variant">
            {locale === "vi" ? "Cập nhật" : "Updated"}:{" "}
            {formatDateByLocale(appt.updatedAt, locale)}
          </span>
        </div>
      </div>
    </div>
  );
}
