#!/usr/sbin/dtrace -Zs

#pragma D option quiet


dtrace:::BEGIN
{
	printf("Tracing hapi requests.\n");
}

hapi*:::request
{
  printf("id: %s, method: %s, path: %s, headers: %s\n", copyinstr(arg0), copyinstr(arg1), copyinstr(arg2), copyinstr(arg3));
}
