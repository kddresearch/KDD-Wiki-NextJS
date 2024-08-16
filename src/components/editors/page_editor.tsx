"use client";

import { legacyPageSchema } from "@/models/legacy-page";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import TextEditor from "@/components/editors/lexical/editor";
import Page from "@/models/legacy-page";
import { priorityValues } from "@/models/legacy-page";
import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { DropdownRadioSelect } from "../ui/dropdown-radio-select";

const submitPage = async (page: Page) => {
  console.log(page);

  const response = await fetch(`/api/page/${page.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(page)
  });

  if (!response.ok) {
    throw new Error('Failed to submit page');
  }

  const data = await response.json();
  return new Page(data);
}

function PageEditor({ inputPage }: { inputPage: object }) {
  const queryClient = useQueryClient();
  const page = new Page(inputPage);
  const pageEditorForm = useForm<z.infer<typeof legacyPageSchema>>({
    resolver: zodResolver(legacyPageSchema),
    defaultValues: page
  });
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation(submitPage, {
    onSuccess: data => {
      toast({
        title: 'Page submitted successfully!',
        description: `Updated page ${data.title}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['page', page.id]);
    }
  })

  const onSubmit = (values: z.infer<typeof legacyPageSchema>) => {
    mutate(new Page(values));
  };

  return (
    <Form {...pageEditorForm}>
      <form onSubmit={pageEditorForm.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={pageEditorForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>
                Displayed at the top of the page
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={pageEditorForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>
                Used in the URL
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={pageEditorForm.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityValues.map((priority, index) => (
                    <SelectItem key={index} value={priority.toString()}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Determines the order in which pages are displayed
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={pageEditorForm.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextEditor markdown={field.value} onMardownContentChange={field.onChange} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Page
        </Button>
      </form>
    </Form>
  );
}

export default PageEditor;