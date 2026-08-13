---
title: "PlusDental — Clinic App Redesign"
company: PlusDental
role: "Tablet UX Design & Research / UI Design"
timeframe: "2022"
summary: "Redesigning the clinic-facing app used in day-to-day dental treatment workflows."
tags: ["Health tech", "App", "Redesign"]
order: 6
featured: true
accent: "#2AB3A6"
thumb: /work/plusdental-clinic-app/tile.png
---

## Product Description

The Clinic App is one of the main digital products offered by PlusDental. Its purpose is to:

- Give dental assistants an overview of the patients who have clinic appointments.
- Allow dental assistants to see what type of appointments patients have.
- Give dentists an overview of how many appointments they have for the week.
- Show dentists how many appointments they fulfilled and how many they missed.
- Allow patients who come to the clinic to fill out their anamnesis.
- Allow patients who come to the clinic to fill out their personal information.
At which point does the Clinic App play a role throughout the user journey?


## What do medical assistants do and why there is a need for improvement?


## Problem description

The clinic app has been implemented as a native iPad app for the Apple store. This has major disadvantages:

The app has never been officially approved by Apple. Even if it would be approved, any update needs to be reviewed again (which can take up to 24 hours) and it could be rejected (as it happened with an older version).

As a workaround, the distribution to the partner dentist’s iPads is done via Testflight. Testflight is not meant to be used for the distribution of a production app. In Testflight every app installation must be re-activated after 90 days, which causes issues and manual effort on the partner dentist’s side.

Apple has given a scheduled deadline for the app's removal from the AppStore. This makes it crucial that we designed a new app.

Maintaining a native app store app requires additional expertise and effort (e. g. deployment) in the Engineering team.

There’s no clear advantage to offering the clinic app via the app store at all.

The UI looks outdated:

The UI doesn’t stick to our CI.

We assume its current look and feel does not give the impression to partner dentists of PlusDental being a MedTech company.

The weak UX slows down the process:


## OLD App state before the redesign


![](/work/plusdental-clinic-app/01.png)


![](/work/plusdental-clinic-app/02.png)


![](/work/plusdental-clinic-app/03.png)


## Business Objectives

Change requests can be implemented and deployed quickly without depending on any third party.

Maintaining the app and extending its feature set is easier and all developers are able to implement them.

Simplify the workflow and distribution of the app for our partner dentists.

Make the clinic app visually and experience-wise consistent with our current digital products

Address all the usability issues discovered during research and testing.


## Research Steps

1. Workshop with current Clinic managers from PlusDental

2. Top Insights from the workshop

Doctors don’t have a way to navigate to both future and past appointments and so they rely on Google Calendar to do so.

Doctors see the information they don’t care about in each time slot such as “When the appointment was booked”, and “Patient’s email”.

Doctors cannot quickly check what type of appointment patients are coming for. Types such as: 3D Scan, IPR, and Implants.

Patients can freely navigate to areas of the app which are restricted for them and should be accessible only by doctors or assistants.

Doctors don't have a way to reset their passwords.

Patients are not able to fill out the form before the clinic visit (to be discussed for which type of patients this should be)

3. Wireframing and Prototyping

I have created an interactive prototype addressing all the insights from the initial workshop as well as suggesting a new UX/UI direction fitting to our other digital products.

Preview of some very high fidelity wireframe screens:


![](/work/plusdental-clinic-app/04.png)

4. Testing the prototype with real dental assistants

Since the app is also being used by dental assistants, I wanted to gain insights from them initially.

5. Top insights discovered during the stakeholder user interviews


![](/work/plusdental-clinic-app/05.png)

6. Prioritizing the most impactful insights

In order to stick to our main business objectives, we had to prioritize what insights we think are most impactful.

In turn, every prioritized insight had to be transformed into the classical How Might We questions so that it can allow us to think broader when coming up with a solution

Outcome:

7. Quick Usability Test with users

I have used rapidusertests.com to quickly run a usability test for the Form Filling and the Anamnesis feature which is used by patients.


![](/work/plusdental-clinic-app/06.png)

8. Designing a final solution.

After knowing what worked and what didn't with the features facing the users/patient side of the app and knowing what features would solve our business objectives I can finally take every learning and come up with a final solution, for now.


![](/work/plusdental-clinic-app/07.png)


![](/work/plusdental-clinic-app/08.png)


![](/work/plusdental-clinic-app/09.png)


![](/work/plusdental-clinic-app/10.png)


![](/work/plusdental-clinic-app/11.png)


## Complete Flow inside Figma


![](/work/plusdental-clinic-app/12.png)


## Bonus feature

Due to the product having been developed as a Web App, it can also be used on a mobile device.

This sometimes solves the problem of some clinics not having received the iPad yet from PlusDental.


## Next steps are planned for collecting insights along the way


## Results

As of 2022, appointment durations were reduced from 30 minutes to 20 minutes on average due to the reduced complexity offered by the redesigned app of the process of when the patient arrives and undergoes the 3D scan.

This data was given as qualitative feedback by our Berlin clinic.
