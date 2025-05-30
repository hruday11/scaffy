import type { BackendStructure } from '@/types/api';

export function generatePrismaSchema(structure: BackendStructure): string {
  let schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

`;

  // Generate models from the database structure
  structure.database.tables.forEach(table => {
    schema += `model ${table.name} {\n`;
    
    // Add fields
    table.fields.forEach(field => {
      const constraints = field.constraints.length > 0 
        ? ` ${field.constraints.join(' ')}` 
        : '';
      schema += `  ${field.name} ${field.type}${constraints}\n`;
    });

    // Add relationships
    table.relationships.forEach(rel => {
      if (rel.type === 'many_to_one') {
        schema += `  ${rel.table.toLowerCase()} ${rel.table} @relation(fields: [${rel.table.toLowerCase()}Id], references: [id])\n`;
        schema += `  ${rel.table.toLowerCase()}Id String\n`;
      } else if (rel.type === 'one_to_many') {
        schema += `  ${rel.table.toLowerCase()}s ${rel.table}[]\n`;
      }
    });

    schema += '}\n\n';
  });

  return schema;
}

export function generateMigrationScript(structure: BackendStructure): string {
  // Generate SQL migration based on the structure
  let sql = '-- CreateTable\n';
  
  structure.database.tables.forEach(table => {
    sql += `CREATE TABLE "${table.name}" (\n`;
    
    // Add fields
    const columns = table.fields.map(field => {
      const type = mapPrismaToSQLType(field.type);
      const constraints = field.constraints
        .map(c => mapPrismaConstraintToSQL(c))
        .filter(Boolean)
        .join(' ');
      return `  "${field.name}" ${type}${constraints ? ' ' + constraints : ''}`;
    });

    // Add foreign keys for relationships
    table.relationships
      .filter(rel => rel.type === 'many_to_one')
      .forEach(rel => {
        columns.push(`  "${rel.table.toLowerCase()}Id" TEXT REFERENCES "${rel.table}"(id)`);
      });

    sql += columns.join(',\n');
    sql += '\n);\n\n';
  });

  return sql;
}

function mapPrismaToSQLType(prismaType: string): string {
  switch (prismaType.toLowerCase()) {
    case 'string':
      return 'TEXT';
    case 'int':
      return 'INTEGER';
    case 'float':
    case 'decimal':
      return 'REAL';
    case 'boolean':
      return 'BOOLEAN';
    case 'datetime':
      return 'TIMESTAMP';
    default:
      return 'TEXT';
  }
}

function mapPrismaConstraintToSQL(constraint: string): string {
  if (constraint.startsWith('@')) {
    constraint = constraint.substring(1);
  }
  
  switch (constraint.toLowerCase()) {
    case 'id':
      return 'PRIMARY KEY';
    case 'unique':
      return 'UNIQUE';
    case 'default(now())':
      return "DEFAULT CURRENT_TIMESTAMP";
    case 'default(cuid())':
      return ''; // Handle CUID generation in the application layer
    default:
      return '';
  }
} 