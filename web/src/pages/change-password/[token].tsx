import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
      const router = useRouter();
     const [,changePassword] = useChangePasswordMutation();
      const [tokenError,setTokenError] = useState('');
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({newPassword: values.newPassword,token});
            if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
               if('token' in errorMap) {
                   setTokenError(errorMap.token)
                   }
          
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              //worked
              router.push("/");
            }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Box>
            {tokenError ? (
              <Flex>
                <Box mr={2} style={{ color: "red" }}>{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>go get a new one </Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
