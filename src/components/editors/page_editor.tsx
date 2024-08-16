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
import { Input } from "@/components/ui/input"

import TextEditor from "@/components/editors/lexical/editor";
import Page from "@/models/legacy-page";
import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const submitPage = async (page: Page) => {
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