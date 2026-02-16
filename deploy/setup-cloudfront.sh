#!/bin/bash
# PowderRank CloudFront Setup
#
# Prerequisites:
#   - AWS CLI configured (aws configure)
#   - EC2 instance running with the app on port 80
#
# Usage:
#   bash deploy/setup-cloudfront.sh <ec2-public-dns>
#
# With custom domain:
#   bash deploy/setup-cloudfront.sh <ec2-public-dns> powderrank.com <acm-cert-arn>

set -euo pipefail

ORIGIN="${1:?Usage: $0 <ec2-public-dns> [custom-domain] [acm-cert-arn]}"
DOMAIN="${2:-}"
CERT_ARN="${3:-}"
STACK_NAME="powderrank-cdn"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Deploying PowderRank CloudFront ==="
echo "Origin: $ORIGIN"
[ -n "$DOMAIN" ] && echo "Custom domain: $DOMAIN"

aws cloudformation deploy \
  --template-file "$SCRIPT_DIR/cloudfront.json" \
  --stack-name "$STACK_NAME" \
  --parameter-overrides \
    OriginDomain="$ORIGIN" \
    DomainName="$DOMAIN" \
    CertificateArn="$CERT_ARN" \
  --no-fail-on-empty-changeset

echo ""
echo "=== CloudFront deployed ==="
echo ""

CF_DOMAIN=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomain`].OutputValue' --output text)
DIST_ID=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)

echo "CloudFront URL: https://$CF_DOMAIN"
echo "Distribution ID: $DIST_ID"
echo ""
if [ -n "$DOMAIN" ]; then
  echo "DNS setup: Create a CNAME (or Route 53 alias) pointing"
  echo "  $DOMAIN → $CF_DOMAIN"
fi
echo ""
echo "To invalidate cache after a deploy:"
echo "  aws cloudfront create-invalidation --distribution-id $DIST_ID --paths '/*'"
