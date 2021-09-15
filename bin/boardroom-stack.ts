#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BoardroomStackStack } from '../lib/boardroom-stack-stack';

const app = new cdk.App();
new BoardroomStackStack(app, 'BoardroomStackStack');
