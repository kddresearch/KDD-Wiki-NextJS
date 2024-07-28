"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LinkDialogProps extends DialogProps {
  defaultText?: string;
  callback?: (values: z.infer<typeof linkFormSchema>) => void;
}

const linkFormSchema = z.object({
  uri: z.string().url({ message: "Invalid URL" }),
  text: z.string().min(1, { message: "Text must be at least 1 character" }),
});

function LinkDialog({
  defaultText,
  callback,
  ...props
}:
  LinkDialogProps
) {

  console.log("defultText", defaultText);
  console.log("typeof defaultText", typeof defaultText);

  if (typeof defaultText !== "string") {
    defaultText = "";
    console.log("defaultText is not a string");
  }

  const textDisabled = defaultText ? true : false;

  const form = useForm<z.infer<typeof linkFormSchema>>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      uri: "https://www.kddresearch.org",
      text: defaultText,
    },
  })

  function onSubmit(values: z.infer<typeof linkFormSchema>) {
    console.log(values)
  }

  return (
    <Dialog {...props}>
      <DialogContent aria-describedby="Dialog box for a URL form">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="uri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.kddresearch.org" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is where the link will take you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Input placeholder="KDD Research" readOnly={textDisabled} {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the text that will be displayed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Insert</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default LinkDialog;