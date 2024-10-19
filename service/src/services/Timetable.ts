import { Timetable } from "@prisma/client";
import { prisma } from "../db";
import { Result, Ok, Err } from "ts-results";
import { AccountService } from ".";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()
import { ScheduledEvent } from "@prisma/client";

export const createTimetable = async (
  email: string,
  name: string,
  scheduledEventIds: string[],
): Promise<Result<Timetable, Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  const events = await prisma.scheduledEvent.findMany({
    where: {
      id: {
        in: scheduledEventIds.map((id) => parseInt(id)),
      },
    },
  });
  const checkForOverlaps = (events: ScheduledEvent[]): boolean => {
    const daysMap: { [key: string]: ScheduledEvent[] } = {};
  
    // Populate daysMap with events
    events.forEach(event => {
      event.days.split(',').forEach(day => {
        if (!daysMap[day]) daysMap[day] = [];
        daysMap[day].push(event);
      });
    });

    // Check for overlaps in each day
    for (const day in daysMap) {
      const dayEvents = daysMap[day];
      for (let i = 0; i < dayEvents.length; i++) {
        for (let j = i + 1; j < dayEvents.length; j++) {
          if (timesOverlap(dayEvents[i], dayEvents[j])) {
            return true;
          }
        }
      }
    }
    return false;
  };
  const timesOverlap =
    (event1: ScheduledEvent, event2: ScheduledEvent): boolean => {

    const start1 = new Date(`1970-01-01T${event1.startTime}:00`);
    const end1 = new Date(`1970-01-01T${event1.endTime}:00`);
    const start2 = new Date(`1970-01-01T${event2.startTime}:00`);
    const end2 = new Date(`1970-01-01T${event2.endTime}:00`);
  
    return (start1 < end2 && start2 < end1);
  };

  if (checkForOverlaps(events)) {
    return Err(new Error("Course times overlap"));
  }

  const timetable = await prisma.timetable.create({
    data: {
      name,
      account: {
        connect: {
          id: account.id,
        },
      },
      timetableEvents: {
        create: scheduledEventIds.map((id) => ({
          scheduledEvent: {
            connect: {
              id: parseInt(id),
            },
          },
        })),
      },
    },
  });

  // Send an email notification using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, Outlook, etc.
    auth: {
      user: process.env.EMAIL, // Replace with your email
      pass: process.env.PASS,  // Replace with your email password
    },
  });

  // Construct the email content
  const mailOptions = {
    from: process.env.EMAIL,
    to: email, // Send to the user's email
    subject: 'Timetable Created',
    text: `Dear ${email},\n\nYour new timetable "${name}" has been successfully created.\n\nBest regards,\nYour Hogwarts Team`
  };

  // Send the email and handle any errors
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }

  return Ok(timetable);
};

export const getTimetableById = async (
  id: number,
): Promise<Result<Timetable, Error>> => {
  const timetable = await prisma.timetable.findUnique({
    where: {
      id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (timetable === null) {
    return Err(new Error("Timetable not found"));
  }

  return Ok(timetable);
};

export const getAccountTimetables = async (
  email: string,
): Promise<Result<Timetable[], Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  const timetables = await prisma.timetable.findMany({
    where: {
      accountId: account.id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  return Ok(timetables);
};
