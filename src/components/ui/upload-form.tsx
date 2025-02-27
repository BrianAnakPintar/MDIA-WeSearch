import { Fieldset, Input, Textarea } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"

import React from 'react'

const UploadForm = () => {
  return (
    <Fieldset.Root size="lg" invalid>
      <Fieldset.Legend>Upload Paper</Fieldset.Legend>
      <Fieldset.Content>
        <Field label="Title">
          <Input name="title" />
        </Field>
        <Field label="Description">
          <Textarea name="description" />
        </Field>
      </Fieldset.Content>
    </Fieldset.Root>
  )
}

export default UploadForm