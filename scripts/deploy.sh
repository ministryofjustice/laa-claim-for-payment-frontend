#!/bin/bash

ENVIRONMENT=$1
# Convert the branch name into a string that can be turned into a valid URL
  BRANCH_RELEASE_NAME=$(echo "$GITHUB_REF_NAME" | tr '[:upper:]' '[:lower:]' | sed 's:^\w*\/::' | tr -s ' _/[]().' '-' | cut -c1-18 | sed 's/-$//')

deploy_branch() {
# Set the deployment host, this will add the prefix of the branch name e.g el-257-deploy-with-circleci or just main
  RELEASE_HOST="$BRANCH_RELEASE_NAME-laa-claim-for-payment-frontend-uat.cloud-platform.service.justice.gov.uk"
# Set the ingress name, needs release name, namespace and -green suffix
  IDENTIFIER="$BRANCH_RELEASE_NAME-laa-claim-for-payment-frontend-$K8S_NAMESPACE-green"
  echo "Deploying commit: $GITHUB_SHA under release name: '$BRANCH_RELEASE_NAME'..."

  helm upgrade "$BRANCH_RELEASE_NAME" ./deploy/laa-claim-for-payment-frontend/. \
                --install --wait \
                --namespace="${K8S_NAMESPACE}" \
                --values ./deploy/laa-claim-for-payment-frontend/values/"$ENVIRONMENT".yaml \
                --set image.repository="$REGISTRY/$REPOSITORY" \
                --set image.tag="$IMAGE_TAG" \
                --set ingress.annotations."external-dns\.alpha\.kubernetes\.io/set-identifier"="$IDENTIFIER" \
                --set ingress.hosts[0].host="$RELEASE_HOST" \
                --set env.SERVICE_NAME="$SERVICE_NAME" \
                --set env.SERVICE_PHASE="$SERVICE_PHASE" \
                --set env.DEPARTMENT_NAME="$DEPARTMENT_NAME" \
                --set env.DEPARTMENT_URL="$DEPARTMENT_URL" \
                --set env.CONTACT_EMAIL="$CONTACT_EMAIL" \
                --set env.CONTACT_PHONE="$CONTACT_PHONE" \
                --set env.SERVICE_URL="$SERVICE_URL" \
                --set env.SESSION_SECRET="$SESSION_SECRET" \
                --set env.SESSION_NAME="$SESSION_NAME" \
                --set env.RATELIMIT_HEADERS_ENABLED="$RATELIMIT_HEADERS_ENABLED" \
                --set env.RATELIMIT_STORAGE_URI="$RATELIMIT_STORAGE_URI" \
                --set env.RATE_LIMIT_MAX="$RATE_LIMIT_MAX" \
                --set env.RATE_WINDOW_MS="$RATE_WINDOW_MS" \
                --set env.NODE_ENV="$NODE_ENV"\
                --set env.OIDC_SCOPE="$OIDC_SCOPE" \
                --set env.OIDC_LOGIN_PATH="$OIDC_LOGIN_PATH" \
                --set env.OIDC_CLIENT_SECRET="$OIDC_CLIENT_SECRET" \
                --set env.OIDC_CALLBACK_PATH="$OIDC_CALLBACK_PATH" \
                --set env.OIDC_LOGOUT_PATH="$OIDC_LOGOUT_PATH" \
                --set env.AUTH_ENABLED="$AUTH_ENABLED" \
                --set env.BASE_URL="$BASE_URL" \
                --set env.CLIENT_ID="$CLIENT_ID" \
                --set env.USE_SSL="$USE_SSL" \
                --set env.ISSUER_BASE_URL="$ISSUER_BASE_URL"
}

deploy_main() {  
  helm upgrade laa-claim-for-payment-frontend ./deploy/laa-claim-for-payment-frontend/. \
                          --install --wait \
                          --namespace="${K8S_NAMESPACE}" \
                          --values ./deploy/laa-claim-for-payment-frontend/values/"$ENVIRONMENT".yaml \
                          --set image.repository="$REGISTRY/$REPOSITORY" \
                          --set image.tag="$IMAGE_TAG" \
                          --set env.SERVICE_NAME="$SERVICE_NAME" \
                          --set env.SERVICE_PHASE="$SERVICE_PHASE" \
                          --set env.DEPARTMENT_NAME="$DEPARTMENT_NAME" \
                          --set env.DEPARTMENT_URL="$DEPARTMENT_URL" \
                          --set env.CONTACT_EMAIL="$CONTACT_EMAIL" \
                          --set env.CONTACT_PHONE="$CONTACT_PHONE" \
                          --set env.SERVICE_URL="$SERVICE_URL" \
                          --set env.SESSION_SECRET="$SESSION_SECRET" \
                          --set env.SESSION_NAME="$SESSION_NAME" \
                          --set env.RATELIMIT_HEADERS_ENABLED="$RATELIMIT_HEADERS_ENABLED" \
                          --set env.RATELIMIT_STORAGE_URI="$RATELIMIT_STORAGE_URI" \
                          --set env.RATE_LIMIT_MAX="$RATE_LIMIT_MAX" \
                          --set env.RATE_WINDOW_MS="$RATE_WINDOW_MS" \
                          --set env.NODE_ENV="$NODE_ENV"\
                          --set env.OIDC_SCOPE="$OIDC_SCOPE" \
                          --set env.OIDC_LOGIN_PATH="$OIDC_LOGIN_PATH" \
                          --set env.OIDC_CLIENT_SECRET="$OIDC_CLIENT_SECRET" \
                          --set env.OIDC_CALLBACK_PATH="$OIDC_CALLBACK_PATH" \
                          --set env.OIDC_LOGOUT_PATH="$OIDC_LOGOUT_PATH" \
                          --set env.AUTH_ENABLED="$AUTH_ENABLED" \
                          --set env.BASE_URL="$BASE_URL" \
                          --set env.CLIENT_ID="$CLIENT_ID" \
                          --set env.USE_SSL="$USE_SSL" \
                          --set env.ISSUER_BASE_URL="$ISSUER_BASE_URL"
}

if [[ "$GITHUB_REF_NAME" == "main" ]]; then
  deploy_main
else
  if deploy_branch; then
    echo "Deploy succeeded"
  else
    echo "Deploy failed. Attempting rollback"
    if helm rollback "$BRANCH_RELEASE_NAME"; then
      echo "Rollback succeeded. Retrying deploy"
      deploy_branch
    else
      echo "Rollback failed. Consider manually running 'helm delete $BRANCH_RELEASE_NAME'"
      exit 1
    fi
  fi
fi
