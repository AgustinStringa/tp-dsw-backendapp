import { CronJob } from "cron";
import { membershipService } from "../../modules/membership/membership/membership.service.js";
import { registrationService } from "../../modules/class/registration/registration.service.js";

export const setupCronJobs = () => {
  new CronJob(
    `00 00 21 * * *`, // ss mm hh - A las 21:00 de Argentina
    async () => {
      try {
        await membershipService.sendMembershipExpirationsNotification();

        await registrationService.deleteRegistrationsWithoutMembership();
      } catch (error: unknown) {
        console.log(`Error en tareas automatizadas: ${error}`);
      }
    },
    null,
    true
  );
};
